import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantDisclosureFields = {
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
	},
	completed: {
		type: GraphQLBoolean,
		description: "Shows if this record is completed"
	}
};

export default ApplicantDisclosureFields;
