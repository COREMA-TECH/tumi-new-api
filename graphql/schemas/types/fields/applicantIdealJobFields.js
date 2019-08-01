import { GraphQLNonNull, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';

const ApplicantIdealJobFields = {
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Form Id'
	},
	description: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Ideal Job Description'
	},
	idPosition: {
		type: GraphQLInt,
		description: 'Position Id'
	},
	isDefault: {
		type: GraphQLBoolean,
		description: 'Is Default'
	}
};

export default ApplicantIdealJobFields;
