import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLNonNull } from 'graphql';
import { EmployeesType } from '../types/operations/outputTypes';
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
            idEntity: {
                type: GraphQLInt
            },
            idUsers: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Employees.findAll({ where: args });
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

            return Db.models.Contacts.findAll({ where: { Id_Entity: args.idEntity } }).then(_contacts => {
                var applicationIds = [], filter = {};
                _contacts.map(_record => {
                    if (_record.dataValues.ApplicationId)
                        applicationIds.push(_record.dataValues.ApplicationId);
                })
                if (applicationIds.length > 0)
                    filter = { id: { $in: applicationIds } }

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
                                    where: { ...filter, isActive: true },
                                    required: true
                                }
                            ]
                        }
                    ]
                }).then(_employees => {
                    let employeeList = [];
                    _employees.map(_record => {
                        _record.dataValues.idEntity = args.idEntity;
                        employeeList.push(_record);//add employees realated to contacts within filtered entity
                    })
                    //Get active applications assosiated to a specific company
                    return Db.models.Employees.findAll({
                        where: { isActive: true, idEntity: args.idEntity },
                        include: [
                            {
                                model: Db.models.ApplicationEmployees,
                                required: true,
                                include: [
                                    {
                                        model: Db.models.Applications,
                                        as: "Application",
                                        where: { isActive: true, id: { $notIn: applicationIds } },
                                        required: true
                                    }
                                ]
                            }
                        ]
                    }).then(_otherEmployees => {
                        _otherEmployees.map(_record => {
                            _record.dataValues.idEntity = args.idEntity;
                            employeeList.push(_record);//add employees not realated to contacts and filtered by application entityId column
                        })
                        return employeeList;
                    })

                })

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
                    }
                ]
            });
        }
    }
};

export default EmployeesQuery;
