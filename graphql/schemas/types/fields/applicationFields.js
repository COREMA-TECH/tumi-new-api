import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicationFields = {
	idLanguage: {
		type: GraphQLString,
		description: 'Application Language'
	},
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
	lastname2: {
		type: GraphQLString,
		description: 'Applicant Second Last Name'
	},
	date: {
		type: GraphQLDate,
		description: 'Applicant Date'
	},
	streetAddress: {
		type: GraphQLString,
		description: 'Applicant Street Address'
	},
	emailAddress: {
		type: GraphQLString,
		description: 'Applicant Email Address'
	},
	aptNumber: {
		type: GraphQLString,
		description: 'Applicant Apt Number'
	},
	city: {
		type: GraphQLString,
		description: 'Applicant City'
	},
	state: {
		type: GraphQLString,
		description: 'Applicant State'
	},
	zipCode: {
		type: GraphQLString,
		description: 'Applicant Zip Code'
	},
	homePhone: {
		type: GraphQLString,
		description: 'Applicant Phone Home'
	},
	cellPhone: {
		type: GraphQLString,
		description: 'Applicant Cell Phone'
	},
	socialSecurityNumber: {
		type: GraphQLString,
		description: 'Applicant Social Security Number'
	},
	positionApplyingFor: {
		type: GraphQLInt,
		description: 'Applicant Possition Applying for'
	},

	birthDay: {
		type: GraphQLDate,
		description: 'Applicant Birthday'
	},
	car: {
		type: GraphQLBoolean,
		description: 'Applicant Has car?'
	},
	typeOfId: {
		type: GraphQLInt,
		description: 'Applicant type of Id'
	},
	expireDateId: {
		type: GraphQLDate,
		description: 'Applicant Id Expiration Date'
	},

	dateAvailable: {
		type: GraphQLDate,
		description: 'Applicant Date Avalilable'
	},
	scheduleRestrictions: {
		type: GraphQLBoolean,
		description: 'Applicant Schedule Restrictions'
	},
	scheduleExplain: {
		type: GraphQLString,
		description: 'Applicant scheduleExplain'
	},
	convicted: {
		type: GraphQLBoolean,
		description: 'Applicant Convicted'
	},
	convictedExplain: {
		type: GraphQLString,
		description: 'Applicant Convicted Explanation'
	},
	comment: {
		type: GraphQLString,
		description: 'Applicant Comment'
	},
	generalComment: {
		type: GraphQLString,
		description: 'Applicant General Comment'
	},
	signature: {
		type: GraphQLString,
		description: 'Applicant Signature'
	},
	idealJob: {
		type: GraphQLString,
		description: 'Applicant Ideal Jobs'
	},
	isLead: {
		type: GraphQLBoolean,
		description: 'Is this application for lead'
	},
	idRecruiter: {
		type: GraphQLInt,
		description: 'Is this application for Id Recruiter'
	},
	idWorkOrder: {
		type: GraphQLInt,
		description: 'Is this application for Id Work Order'
	},
	idStages: {
		type: GraphQLInt,
		description: 'Is this application for Id Stages'
	},
	isActive: {
		type: GraphQLBoolean,
		description: 'Applicant Status'
	}
};

export default ApplicationFields;
