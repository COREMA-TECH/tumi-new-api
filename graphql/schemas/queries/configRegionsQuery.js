import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { ConfigRegionsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const configRegionsQuery = {
    configregions: {
        type: new GraphQLList(ConfigRegionsType),
        description: 'List employees records',
        args: {
            regionId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.ConfigRegions.findAll({ where: args });
        }
    }
};

export default configRegionsQuery;
