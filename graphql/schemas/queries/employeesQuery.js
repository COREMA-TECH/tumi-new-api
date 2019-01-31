import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { EmployeesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

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
                                required: true,
                                where: { socialSecurityNumber: { [Op.ne]: null } }
                            }
                        ]
                    },
                    {
                        model: Db.models.ShiftDetailEmployees,
                        required: true
                    }
                ]
            });
        }
    }
};

export default EmployeesQuery;
