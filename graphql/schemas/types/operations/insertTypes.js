import { GraphQLInputObjectType } from 'graphql';

import {
	ApplicantLanguagesFields,
	ApplicationFields,
	ElectronicAddressFields,
	ApplicantEducationFields,
	ApplicantPreviousEmploymentFields
} from '../fields';

const inputInsertApplication = new GraphQLInputObjectType({
	name: 'inputInsertApplication',
	description: 'Inputs for Application Mutation',

	fields: {
		...ApplicationFields
	}
});

const inputInsertApplicantEducation = new GraphQLInputObjectType({
	name: 'inputInsertApplicantEducation',
	description: 'Inputs for Applicant Educations Mutation',

	fields: {
		...ApplicantEducationFields
	}
});

const inputInsertApplicantLanguage = new GraphQLInputObjectType({
	name: 'inputInsertApplicantLanguage',
	description: 'Inputs for Applicant Languages Mutation',

	fields: {
		...ApplicantLanguagesFields
	}
});
const inputInsertApplicantPreviousEmployment = new GraphQLInputObjectType({
	name: 'inputInsertApplicantPreviousEmployment',
	description: 'Inputs for Applicant Previous Employment Mutation',

	fields: {
		...ApplicantPreviousEmploymentFields
	}
});
const iParamEA = new GraphQLInputObjectType({
	name: 'iParamEA',
	description: 'Input Parameter for Electronic Address Mutation',

	fields: {
		...ElectronicAddressFields
	}
});

export {
	inputInsertApplicantLanguage,
	inputInsertApplication,
	inputInsertApplicantEducation,
	inputInsertApplicantPreviousEmployment,
	iParamEA
};