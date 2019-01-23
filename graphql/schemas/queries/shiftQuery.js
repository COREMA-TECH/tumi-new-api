import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { ShiftType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftQuery = {
    shift: {
        type: new GraphQLList(ShiftType),
        description: 'List Shift records',
        args: {
            id: {
                type: GraphQLInt
            },
            isTemplate: {
                type: GraphQLBoolean,
                defaultValue: false
            },
            isActive: {
                type: GraphQLBoolean,
                defaultValue: true
            },
            entityId: {
                type: GraphQLInt
            },
            departmentId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Shift.findAll({ where: args });
        }
    }
};

export default ShiftQuery;
