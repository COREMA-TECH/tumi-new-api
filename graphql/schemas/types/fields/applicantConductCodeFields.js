import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantConductCodeFields = {
	signature: {
		type: GraphQLString,
		description: 'Applicant Signature'
	},
	content: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'content'
	},
	date: {
		type: GraphQLDate,
		description: 'Signature Date'
	},
	applicantName: {
		type: GraphQLString,
		description: 'Applicant Name'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantConductCodeFields;
