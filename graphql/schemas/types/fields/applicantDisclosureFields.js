import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantDisclosureFields = {
	signature: {
		type: GraphQLString,
		description: 'Applicant Signature for Application Form'
	},
	content: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Disclosure content'
	},
	date: {
		type: GraphQLDate,
		description: 'Application Signature Date'
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

export default ApplicantDisclosureFields;
