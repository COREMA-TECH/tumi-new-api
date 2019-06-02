import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { BreakRuleDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const BreakRuleDetailQuery = {
    breakRuleDetails: {
        type: new GraphQLList(BreakRuleDetailType),
        description: "Get saved break rule details",
        args: {
            id: {
                type: GraphQLInt
            },
            breakRuleId: {
                type: GraphQLInt
            },
            shiftReached: {
                type: GraphQLFloat
            },
            isRepeating: {
                type: GraphQLBoolean
            },
            days: {
                type: GraphQLString
            },
            breakStartTime: {
                type: GraphQLString
            },
            breakPlacement: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
			return Db.models.BreakRuleDetail.findAll({ where: args });
		}
    }
}

export default BreakRuleDetailQuery;