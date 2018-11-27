import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { phaseworkOrderType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const phaseworkOrderQuery = {
    phaseworkOrder: {
        type: new GraphQLList(phaseworkOrderType),
        description: 'List phaseworkOrder records',
        args: {
            id: {
                type: GraphQLInt
            },
            WorkOrderId: {
                type: GraphQLInt
            }

        },
        resolve(root, args) {
            return Db.models.PhaseWorkOrder.findAll({ where: args, order: [['id']] });
        }
    }
};

export default phaseworkOrderQuery;
