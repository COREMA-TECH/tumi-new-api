import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean, graphql } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicationFields = {
	idLanguage: {
		type: GraphQLString,
		description: 'Application Language'
	},
	firstName: {
		type: GraphQLString,
		description: 'Applicant First Name'
	},
	middleName: {
		type: GraphQLString,
		description: 'Applicant Middle Name'
	},
	lastName: {
		type: GraphQLString,
		description: 'Applicant Last Name'
	},
	lastName2: {
		type: GraphQLString,
		description: 'Applicant Second Last Name'
	},
	alias: {
		type: GraphQLString,
		description: "AKA field. Provides additional descrition of a person"
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
		type: GraphQLInt,
		description: 'Applicant City'
	},
	state: {
		type: GraphQLInt,
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
	},
	Urlphoto: {
		type: GraphQLString,
		description: 'Applicant Url photo'
	},
	UserId: {
		type: GraphQLInt,
		description: 'Applicant User Id'
	},
	completed: {
		type: GraphQLBoolean,
		description: 'Shows if an application is completed'
	},
	directDeposit: {
		type: GraphQLBoolean,
		description: 'Shows if an application is direct Deposit'
	},
	createdAt: {
		type: GraphQLDate,
		description: "Date when the record was created"
	},
	pin: {
		type: GraphQLString,
		description: 'Applicant pin'
	},
	dateCreation: {
		type: GraphQLDate,
		description: 'Applicant dateCreation'
	},
	immediately: {
		type: GraphQLBoolean,
		description: 'Applicant immediately'
	},
	optionHearTumi: {
		type: GraphQLInt,
		description: 'Applicant optionHearTumi'
	},
	nameReferences: {
		type: GraphQLString,
		description: 'Applicant nameReferences'
	},
	eeoc: {
		type: GraphQLInt,
		description: 'eeoc'
	},
	exemptions: {
		type: GraphQLInt,
		description: 'exemptions'
	},
	area: {
		type: GraphQLString,
		description: 'area'
	},
	hireType: {
		type: GraphQLInt,
		description: 'hireType'
	},
	gender: {
		type: GraphQLInt,
		description: 'hireType'
	},
	marital: {
		type: GraphQLInt,
		description: 'hireType'
	},
	sendInterview: {
		type: GraphQLBoolean,
		description: 'sendInterview'
	},
	numberId:{
		type: GraphQLString,
		description: 'numberId'
	},
	employmentType: {
		type: GraphQLString,
		description: 'employmentType'
	},
	pdfUrl: {
		type: GraphQLString,
		description: 'Summary file url'
	},
	origin: {
		type: GraphQLString,
		description: 'Applicant origin'
	},
	proofofID: {
		type: GraphQLBoolean,
		description: 'Proof of ID'
	}
};

export default ApplicationFields;
