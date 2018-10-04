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
	emailAddress: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Email Address'
	},
	aptNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Apt Number'
	},
	city: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant City'
	},
	state: {
		type: new GraphQLNonNull(GraphQLString),
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

	birthDay: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Birthday'
	},
	car: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Has car?'
	},
	typeOfId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant type of Id'
	},
	expireDateId: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Id Expiration Date'
	},

	dateAvailable: {
		type: GraphQLDate,
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
	},
	isActive: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Status'
	}
};

export default ApplicationFields;
