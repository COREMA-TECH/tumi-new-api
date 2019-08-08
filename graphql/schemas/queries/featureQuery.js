import { GraphQLList, GraphQLString, GraphQLInt, } from 'graphql';
import { FeatureType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const FeatureQuery = {
    features: {
        type: new GraphQLList(FeatureType),
        args: {
            code: {
                type: GraphQLString
            },
            RoleId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Feature.findAll({ where: args });
        }
    }
}

export default FeatureQuery;