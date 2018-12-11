import { GraphQLInt, GraphQLNonNull, GraphQLBoolean, GraphQLFloat, GraphQLString } from 'graphql';

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
	},
	FiscalMonth1: {
		type: GraphQLInt,
		description: 'Fiscal Month Inicio'
	},
	FiscalMonth2: {
		type: GraphQLInt,
		description: 'Fiscal Month Fin'
	},
	Timezone: {
		type: GraphQLInt,
		description: 'Time Zone'
	},
	time: {
		type: GraphQLString,
		description: 'Time'
	}
};

export default CompanyPreferenceFields;
