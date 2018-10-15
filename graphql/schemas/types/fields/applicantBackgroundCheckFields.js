import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantBackgroundCheckFields = {
	vehicleReportRequired: {
		type: GraphQLBoolean,
		description: 'Will a motor vehicle report be required'
	},
	driverLicenseNumber: {
		type: GraphQLString,
		description: 'Drivers license number'
	},
	commercialDriverLicense: {
		type: GraphQLBoolean,
		description: 'Is this a commercial drivers license'
	},
	licenseState: {
		type: GraphQLString,
		description: 'State'
	},
	licenseExpiration: {
		type: GraphQLDate,
		description: 'Expiration date'
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

export default ApplicantBackgroundCheckFields;
