import { GraphQLList, GraphQLString } from 'graphql';
import { ShiftDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftDetailQuery = {
    ShiftDetail: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            ShiftDetail: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({ where: args });
        }
    }
};

export default ShiftDetailQuery;
