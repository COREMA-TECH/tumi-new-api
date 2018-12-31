import { GraphQLList, GraphQLString, GraphQLIncludeDirective, GraphQLInt } from 'graphql';
import { ShiftWorkOrderType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ShiftWorkOrderQuery = {
    ShiftWorkOrder: {
        type: new GraphQLList(ShiftWorkOrderType),
        description: 'List Shift records',
        args: {
            ShiftId: {
                type: GraphQLInt
            },
            WorkOrderId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.ShiftWorkOrder.findAll({ where: args });
        }
    }
};

export default ShiftWorkOrderQuery;
