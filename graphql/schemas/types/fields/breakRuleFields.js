import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean, graphql, GraphQLFloat } from 'graphql';
import GraphQLDate from 'graphql-date';

const BreakRuleFields = {
    name: {
		type: GraphQLString,
		description: 'Rule Name'
    },
    code: {
		type: GraphQLString,
		description: 'Rule Code'
    },
    isPaid: {
		type: GraphQLBoolean,
		description: 'Is this break paid?'
    },
    isAutomatic: {
		type: GraphQLBoolean,
		description: 'Is this break marked automatically?'
    },
    lenght: {
		type: GraphQLFloat,
		description: 'Break duration'
    },
    isActive: {
    type: GraphQLBoolean,
    description: 'Is this rule active?'
    }
}

export default BreakRuleFields;