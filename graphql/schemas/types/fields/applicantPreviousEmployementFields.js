import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLFloat } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantPreviousEmploymentFields = {
	companyName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Previous Employment Company Name'
	},
	phone: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Previous Employment Phone Number'
	},
	address: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Previous Employment Address'
	},
	supervisor: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Previous Employment Supervisor'
	},
	jobTitle: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Previous Employment Job Title'
	},
	payRate: {
		type: new GraphQLNonNull(GraphQLFloat),
		description: 'Applicant Pay Rate'
	},
	startDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Employment Start Date'
	},
	endDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Employment End  Date'
	},
	reasonForLeaving: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Reason for leaving'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantPreviousEmploymentFields;
