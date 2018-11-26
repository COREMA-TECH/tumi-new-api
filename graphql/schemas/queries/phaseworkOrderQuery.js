import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { PhaseWorkOrderType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const PhaseWorkOrderQuery = {
    PhaseWorkOrder: {
        type: new GraphQLList(PhaseWorkOrderType),
        description: 'List PhaseWorkOrder records',
        args: {
            id: {
                type: GraphQLInt
            }

        },
        resolve(root, args) {
            return Db.models.PhaseWorkOrderType.findAll({ where: args });
        }
    }
};

export default PhaseWorkOrderQuery;
