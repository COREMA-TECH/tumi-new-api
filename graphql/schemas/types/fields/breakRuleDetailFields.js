import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean, graphql, GraphQLFloat } from 'graphql';
import GraphQLDate from 'graphql-date';

const BreakRuleFields = {
    breakRuleId: {
    type: GraphQLInt,
    description: 'Break rule this config belongs to'
    },
    shiftReached: {
		type: GraphQLFloat,
		description: 'Break starts at x time into the shift'
    },    
    isRepeating: {
		type: GraphQLBoolean,
		description: 'Should this break repeat over the course of the shift?'
    },
    days: {
		type: GraphQLString,
		description: 'Days covered by this rule'
    },
    breakStartTime: {
		type: GraphQLString,
		description: 'Break starts at'
    },
    breakPlacement: {
        type: GraphQLString,
        description: 'When will the break occur? eg at the Middle of the shift'
    }
}

export default BreakRuleFields;