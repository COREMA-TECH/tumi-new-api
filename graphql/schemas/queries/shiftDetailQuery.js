import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { ShiftDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftDetailQuery = {
    ShiftDetail: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            id: { type: GraphQLInt },
            ShiftId: { type: GraphQLInt }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({ where: args });
        }
    }
};

export default ShiftDetailQuery;
