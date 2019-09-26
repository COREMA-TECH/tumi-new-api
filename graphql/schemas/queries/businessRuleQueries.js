import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLFloat, GraphQLNonNull } from 'graphql';
import Sequelize from 'sequelize';

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
    },

    overlappingRules: {
        type: new GraphQLList(BusinessRuleType),
        args: {
            days: {
                type: GraphQLString
            },
            ruleType: {
                type: new GraphQLNonNull(GraphQLInt)
            }
        },
        async resolve(root, args){
            const days = args.days.match(/(..?)/g);

            const overlapping = await Db.models.BusinessRule.findAll({
                where: {                    
                    catalogItemId: args.ruleType,
                    $or: days.map(item => {
                        return {
                            days: {
                                $like: `%${item}%`
                            }
                        }
                    })
                }
            });
            
            return overlapping;
        }
    }
}

export default businessRuleQuery;