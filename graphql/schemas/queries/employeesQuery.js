import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
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
            id: {
                type: GraphQLInt
            },
            isActive: {
                type: GraphQLBoolean
            },
            idEntity: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Employees.findAll({
                where: args,
                include: [
                    {
                        model: Db.models.ApplicationEmployees,
                        required: true,
                        include: [
                            {
                                model: Db.models.Applications,
                                as: "Application",
                                required: true
                            }
                        ]
                    }
                ]
            });
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
