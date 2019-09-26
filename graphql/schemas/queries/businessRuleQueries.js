import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLFloat } from 'graphql';

import { BusinessRuleType } from '../types/operations/outputTypes';

const businessRuleQuery = {
    businessRules: {
        type: new GraphQLList(BusinessRuleType),
        args: {
            id: {
                type: GraphQLInt
            },
            catalogItemId: {
                type: GraphQLInt
            },
            name: {
                type: GraphQLString
            },
            code: {
                type: GraphQLString
            },
            isPaid: {
                type: GraphQLBoolean
            },
            isAutomatic: {
                type: GraphQLBoolean
            },
            lenght: {
                type: GraphQLFloat
            },
            isActive: {
                type: GraphQLBoolean
            },
        },
        resolve(root, args){
            return Db.models.BusinessRule.findAll({
                where: args,
                order: [
                    ['id', 'ASC'],
                    ['name', 'ASC'],
                ],
            })
        }
    }
}

export default businessRuleQuery;