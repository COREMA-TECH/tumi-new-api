import { GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat } from 'graphql';

const CompanyPreferenceFields = {
	charge: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Skill Description'
	},
	PeriodId: {
		type: GraphQLInt,
		description: 'Skill Description'
	},
	amount: {
		type: GraphQLFloat,
		description: 'Skill Description'
	},
	EntityId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Skill Description'
	}
};

export default CompanyPreferenceFields;
