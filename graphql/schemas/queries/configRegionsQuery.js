import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { ConfigRegionsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const configRegionsQuery = {
    configregions: {
        type: new GraphQLList(ConfigRegionsType),
        description: 'List employees records',
        args: {
            id: {
                type: GraphQLInt
            },
            regionId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.ConfigRegion.findAll({ where: args });
        }
    }
};

export default configRegionsQuery;
