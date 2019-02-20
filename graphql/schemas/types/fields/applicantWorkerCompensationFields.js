import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantWorkerCompensationFields = {
	applicantAddress: {
		type: GraphQLString,
		description: 'Applicant Address'
	},
	applicantCity: {
		type: GraphQLString,
		description: 'Applicant City'
	},
	applicantState: {
		type: GraphQLString,
		description: 'Applicant State'
	},
	applicantZipCode: {
		type: GraphQLString,
		description: 'Applicant Zipcode'
	},
	employerName: {
		type: GraphQLString,
		description: 'Employer Name'
	},
	initialNotification: {
		type: GraphQLBoolean,
		description: 'Is this a initial notification?'
	},
	injuryNotification: {
		type: GraphQLBoolean,
		description: 'Is this a injury notification?'
	},
	injuryDate: {
		type: GraphQLDate,
		description: 'Injury date'
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
	},
	completed: {
		type: GraphQLBoolean,
		description: "Shows if this record is completed"
	}
};

export default ApplicantWorkerCompensationFields;
