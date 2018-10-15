import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantHarassmentPoliciyFields = {
	companyPhoneNumber: {
		type: GraphQLString,
		description: 'Phone number of the company to report violation'
	},
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

export default ApplicantHarassmentPoliciyFields;
