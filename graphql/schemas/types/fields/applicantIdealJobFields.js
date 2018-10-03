import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';

const ApplicantIdealJobFields = {
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Form Id'
	},
	description: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Ideal Job Description'
	}
};

export default ApplicantIdealJobFields;
