import { GraphQLList, GraphQLString, GraphQLIncludeDirective, GraphQLInt } from 'graphql';
import { ShiftType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftQuery = {
    shift: {
        type: new GraphQLList(ShiftType),
        description: 'List Shift records',
        args: {
            id: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Shift.findAll({ where: args });
        }
    }
};

export default ShiftQuery;
