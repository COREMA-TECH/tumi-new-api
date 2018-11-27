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
	ApplicantDisclosureFields,
	ApplicantConductCodeFields,
	ApplicantBackgroundCheckFields,
	ApplicantHarassmentPoliciyFields,
	ApplicantWorkerCompensationFields,
	ApplicantDocumentFields,
	WorkOrderFields,
	WorkOrderPositionFields,
	ApplicationPhaseFields,
	PhaseWorkOrderfields,
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
const inputInsertApplicantConductCode = new GraphQLInputObjectType({
	name: 'inputInsertApplicantConductCode',
	description: 'Inputs for Application Code of Conduct',

	fields: {
		...ApplicantConductCodeFields
	}
});
const inputInsertApplicantBackgroundCheck = new GraphQLInputObjectType({
	name: 'inputInsertApplicantBackgroundCheck',
	description: 'Inputs for Application Background Check',

	fields: {
		...ApplicantBackgroundCheckFields
	}
});

const inputInsertApplicantHarassmentPolicy = new GraphQLInputObjectType({
	name: 'inputInsertApplicantHarassmentPolicy',
	description: 'Inputs for Application Harassment Policy',

	fields: {
		...ApplicantHarassmentPoliciyFields
	}
});

const inputInsertApplicantWorkerCompensation = new GraphQLInputObjectType({
	name: 'inputInsertApplicantWorkerCompensation',
	description: 'Inputs for Application Worker Compensation',

	fields: {
		...ApplicantWorkerCompensationFields
	}
});
const inputInsertApplicantDocument = new GraphQLInputObjectType({
	name: 'inputInsertApplicantDocument',
	description: 'Inputs for Applications Document',

	fields: {
		...ApplicantDocumentFields
	}
});
const inputInsertWorkOrder = new GraphQLInputObjectType({
	name: 'inputInsertWorkOrder',
	description: 'Inputs for Work Order Insert',

	fields: {
		...WorkOrderFields
	}
});
const inputInsertWorkOrderPosition = new GraphQLInputObjectType({
	name: 'inputInsertWorkOrderPosition',
	description: 'Inputs for Work Order Position Insert',

	fields: {
		...WorkOrderPositionFields
	}
});
const inputApplicantPhase = new GraphQLInputObjectType({
	name: 'inputApplicantPhase',
	description: 'Inputs for Work Order Position Insert',

	fields: {
		...ApplicationPhaseFields
	}
});
const inputInsertPhaseWorkOrder = new GraphQLInputObjectType({
	name: 'inputInsertPhaseWorkOrder',
	description: 'Inputs for Work Order Insert',

	fields: {
		...PhaseWorkOrderfields
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
	inputInsertApplicantConductCode,
	inputInsertApplicantBackgroundCheck,
	inputInsertApplicantHarassmentPolicy,
	inputInsertApplicantWorkerCompensation,
	inputInsertApplicantDocument,
	inputInsertWorkOrder,
	inputInsertWorkOrderPosition,
	iParamEA,
	inputApplicantPhase,
	inputInsertPhaseWorkOrder,
};
