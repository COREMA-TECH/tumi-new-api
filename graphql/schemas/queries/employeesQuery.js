import { GraphQLList, GraphQLString } from 'graphql';
import { EmployeesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const EmployeesQuery = {
    employees: {
        type: new GraphQLList(EmployeesType),
        description: 'List employees records',
        args: {
            id: {
                type: GraphQLInt
            },
            isActive: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Employees.findAll({ where: args });
        }
    }
};

export default EmployeesQuery;
