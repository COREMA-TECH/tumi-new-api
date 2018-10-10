import { GraphQLInputObjectType } from 'graphql';

import {
	ApplicantLanguagesFields,
	ApplicationFields,
	ElectronicAddressFields,
	ApplicantEducationFields,
	ApplicantPreviousEmploymentFields,
	ApplicantMilitaryServiceFields,
	ApplicantSkillFields,
	CompanyPreferenceFields,
	ApplicantIdealJobFields,
	ApplicantDisclosureFields
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
const inputInsertApplicantMilitaryService = new GraphQLInputObjectType({
	name: 'inputInsertApplicantMilitaryService',
	description: 'Inputs for Applicant Military Service Mutation',

	fields: {
		...ApplicantMilitaryServiceFields
	}
});
const inputInsertApplicantSkill = new GraphQLInputObjectType({
	name: 'inputInsertApplicantSkill',
	description: 'Inputs for Applicant Skill Mutation',

	fields: {
		...ApplicantSkillFields
	}
});
const inputInsertCompanyPreference = new GraphQLInputObjectType({
	name: 'inputInsertCompanyPreference',
	description: 'Inputs for Company Preference Mutation',

	fields: {
		...CompanyPreferenceFields
	}
});
const inputInsertApplicantIdealJob = new GraphQLInputObjectType({
	name: 'inputInsertApplicantIdealJob',
	description: 'Inputs for Insert Applicant Ideal Job Mutation',

	fields: {
		...ApplicantIdealJobFields
	}
});
const iParamEA = new GraphQLInputObjectType({
	name: 'iParamEA',
	description: 'Input Parameter for Electronic Address Mutation',

	fields: {
		...ElectronicAddressFields
	}
});
const inputInsertApplicantDisclosure = new GraphQLInputObjectType({
	name: 'inputInsertApplicantDisclosure',
	description: 'Inputs for Application Disclosure',

	fields: {
		...ApplicantDisclosureFields
	}
});
export {
	inputInsertApplicantLanguage,
	inputInsertApplication,
	inputInsertApplicantEducation,
	inputInsertApplicantPreviousEmployment,
	inputInsertApplicantMilitaryService,
	inputInsertApplicantSkill,
	inputInsertCompanyPreference,
	inputInsertApplicantIdealJob,
	inputInsertApplicantDisclosure,
	iParamEA
};
