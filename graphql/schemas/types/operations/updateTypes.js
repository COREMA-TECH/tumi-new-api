import { GraphQLInt, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import {
	ApplicantLanguagesFields,
	ApplicationFields,
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
	ApplicantWorkerCompensationFields
} from '../fields';

const inputUpdateApplication = new GraphQLInputObjectType({
	name: 'inputUpdateApplication',
	description: 'Inputs for Application Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicationFields
	}
});

const inputUpdateApplicantLanguage = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantLanguage',
	description: 'Inputs for Applicant Languages Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantLanguagesFields
	}
});

const inputUpdateApplicantEducation = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantEducation',
	description: 'Inputs for Applicant Education Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantEducationFields
	}
});

const inputUpdateApplicantPreviousEmployment = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantPreviousEmployment',
	description: 'Inputs for Applicant Previous Employment Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantPreviousEmploymentFields
	}
});

const inputUpdateApplicantMilitaryService = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantMilitaryService',
	description: 'Inputs for Applicant Military Service Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantMilitaryServiceFields
	}
});
const inputUpdateApplicantSkill = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantSkill',
	description: 'Inputs for Applicant Skill Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantSkillFields
	}
});

const inputUpdateApplicantIdealJob = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantIdealJob',
	description: 'Inputs for Applicant Ideal Job Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantIdealJobFields
	}
});
const inputUpdateCompanyPreference = new GraphQLInputObjectType({
	name: 'inputUpdateCompanyPreference',
	description: 'Inputs for Company Preference Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Company Preference Id'
		},
		...CompanyPreferenceFields
	}
});
const inputUpdateApplicantDisclosure = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantDisclosure',
	description: 'Inputs for Applicant Disclosure Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantDisclosureFields
	}
});
const inputUpdateApplicantConductCode = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantConductCode',
	description: 'Inputs for Applicant Code of Conduct Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantConductCodeFields
	}
});
const inputUpdateApplicantBackgroundCheck = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantBackgroundCheck',
	description: 'Inputs for Applicant Background check Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ApplicantBackgroundCheckFields
	}
});
const inputUpdateApplicantHarassmentPolicy = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantHarassmentPolicy',
	description: 'Inputs for Applicant Harassment Policy Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ApplicantHarassmentPoliciyFields
	}
});
const inputUpdateApplicantWorkerCompensation = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantWorkerCompensation',
	description: 'Inputs for Applicant Worker Compensation Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ApplicantWorkerCompensationFields
	}
});
export {
	inputUpdateApplicantLanguage,
	inputUpdateApplication,
	inputUpdateApplicantEducation,
	inputUpdateApplicantPreviousEmployment,
	inputUpdateApplicantMilitaryService,
	inputUpdateApplicantSkill,
	inputUpdateCompanyPreference,
	inputUpdateApplicantIdealJob,
	inputUpdateApplicantDisclosure,
	inputUpdateApplicantConductCode,
	inputUpdateApplicantBackgroundCheck,
	inputUpdateApplicantHarassmentPolicy,
	inputUpdateApplicantWorkerCompensation
};
