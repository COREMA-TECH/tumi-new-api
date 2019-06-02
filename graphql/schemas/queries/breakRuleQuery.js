import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { BreakRuleType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const BreakRuleQuery = {
    breakRules: {
        type: new GraphQLList(BreakRuleType),
        description: "Get saved break rules",
        args: {
            id: {
                type: GraphQLInt
            },
            businessCompanyId: {
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
		resolve(root, args) {
			return Db.models.BreakRule.findAll({ where: args });
		}
    }
}

export default BreakRuleQuery;