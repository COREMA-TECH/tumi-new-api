import { GraphQLList, GraphQLString, GraphQLIncludeDirective, GraphQLInt, GraphQLBoolean } from 'graphql';
import { ShiftDetailEmployeesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftDetailEmployeesQuery = {
    shiftdetailemployees: {
        type: new GraphQLList(ShiftDetailEmployeesType),
        description: 'List Shift records',
        args: {
            id: {
                type: GraphQLInt
            },
            ShiftDetailId: {
                type: GraphQLInt
            },
            EmployeeId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.ShiftDetailEmployees.findAll({ where: args });
        }
    }
};

export default ShiftDetailEmployeesQuery;
