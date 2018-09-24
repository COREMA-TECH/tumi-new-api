import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicationFields = {
	firstName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant First Name'
	},
	middleName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Middle Name'
	},
	lastName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Last Name'
	},
	date: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Date'
	},
	streetAddress: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Street Address'
	},
	aptNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Apt Number'
	},
	city: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant City'
	},
	state: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant State'
	},
	zipCode: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Zip Code'
	},
	homePhone: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Phone Home'
	},
	cellPhone: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Cell Phone'
	},
	socialSecurityNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Social Security Number'
	},
	positionApplyingFor: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant Possition Applying for'
	},
	dateAvailable: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Date Avalilable'
	},
	scheduleRestrictions: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Schedule Restrictions'
	},
	scheduleExplain: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant scheduleExplain'
	},
	convicted: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Convicted'
	},
	convictedExplain: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Convicted Explanation'
	},
	comment: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Comment'
	}
};

export default ApplicationFields;
