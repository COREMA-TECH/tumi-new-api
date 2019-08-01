import { GraphQLList, GraphQLBoolean, GraphQLInt, GraphQLNonNull } from 'graphql';
import { EmployeesType, EmployeeUniquenessOutputType, EmployeeByHotelType } from '../types/operations/outputTypes';
import { inputEmployeeUniquenessType, inputInsertEmployeeByHotel } from '../types/operations/insertTypes';

import Db from '../../models/models';
import moment from 'moment';

import Sequelize from 'sequelize';
const Op = Sequelize.Op;

const EmployeesQuery = {
    employees: {
        type: new GraphQLList(EmployeesType),
        description: 'List employees records',
        args: {
            id: {
                type: GraphQLInt
            },
            isActive: {
                type: GraphQLBoolean
            },
            idUsers: {
                type: GraphQLInt
            },
            idEntity: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            let { idEntity, ...rest } = args;
            let entityId = {};

            if (idEntity)
                entityId = {BusinessCompanyId: idEntity};

            return Db.models.Employees.findAll({
                where: rest,
                include: [{
                    model: Db.models.EmployeeByHotels,
                    where: entityId
                }, {
                    model: Db.models.ApplicationEmployees,
                    required: true
                }]
            });
        }
    },
    employeesWSSN: {
        type: new GraphQLList(EmployeesType),
        description: 'List employees records with social security number',
        args: {
            idEntity: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        resolve(root, args) {


            //Get actives applications associated to contacts from a specific company
            return Db.models.Employees.findAll({
                where: { isActive: true },
                include: [
                    {
                        model: Db.models.ApplicationEmployees,
                        required: true,
                        include: [
                            {
                                model: Db.models.Applications,
                                as: "Application",
                                where: { isActive: true },
                                required: true
                            }
                        ]
                    },
                    {
                        model: Db.models.EmployeeByHotels,
                        where: { BusinessCompanyId: args.idEntity, isActive: true }
                    }
                ]
            })
        }
    },

    activeEmployees: {
        type: new GraphQLList(EmployeesType),
        description: 'Retrieve active employees based on last marking time',
        args: {
            id: {
                type: GraphQLInt,
            },
        },
        resolve(root, args) {
            return Db.models.Employees.findAll({
                where: args,
                include: [
                    {
                        model: Db.models.MarkedEmployees,
                        required: true,
                        limit: 1,
                        where: {
                            markedDate: {
                                $gt: moment(Date.now()).subtract(2, "week").toDate()
                            }
                        },
                        order: [['markedDate', 'DESC']],
                    },
                    {
                        model: Db.models.EmployeeByHotels,
                        required: false
                    }
                ]
            });
        }
    },
    validateEmployeeUniqueness: {
        type: new GraphQLList(EmployeeUniquenessOutputType),
        description: 'Return an specific Employee filtered by Names and Phone, this is to validate Employee Uniqueness',
        args: {
            employees: {
                type: new GraphQLList(inputEmployeeUniquenessType)
            }
        },
        resolve(root, args) {
            return args.employees.map(_employee => {
                return Db.models.Employees.findOne({
                    where: {
                        $and: [
                            { id: { $ne: _employee.id } },
                            { isActive: true },
                            { mobileNumber: _employee.mobileNumber },
                            Sequelize.where(
                                Sequelize.fn('upper', Sequelize.col('firstName')), {
                                    $eq: _employee.firstName.toUpperCase()
                                }
                            ),
                            Sequelize.where(
                                Sequelize.fn('upper', Sequelize.col('lastName')), {
                                    $eq: _employee.lastName.toUpperCase()
                                }
                            )
                        ]
                    }
                })
                    .then(_ => {
                        return { ..._employee, isUnique: _ === null }
                    })
            })

        }
    }
};

export default EmployeesQuery;
