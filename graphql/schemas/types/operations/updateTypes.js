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
	ApplicantWorkerCompensationFields,
	ApplicantDocumentFields,
	WorkOrderFields,
	WorkOrderPositionFields,
	ApplicationPhaseFields,
	PhaseWorkOrderfields,
	HolidayFields,
	EmployeesFields,
	ShiftFields,
	ShiftDetailFields,
	ShiftDetailEmployeesFields,
	MarkedEmployeesFields,
	RolesFormsFields,
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
const inputUpdateApplicantDocument = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantDocument',
	description: 'Inputs for Applications Document',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ApplicantDocumentFields
	}
});

const inputUpdateWorkOrder = new GraphQLInputObjectType({
	name: 'inputUpdateWorkOrder',
	description: 'Inputs for Work Order Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...WorkOrderFields
	}
});
const inputUpdateWorkOrderPosition = new GraphQLInputObjectType({
	name: 'inputUpdateWorkOrderPosition',
	description: 'Inputs for Work Order Position Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...WorkOrderPositionFields
	}
});
const inputUpdateApplicantPhase = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantPhase',
	description: 'Inputs for Work Order Position Update',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ApplicationPhaseFields
	}
});

const inputUpdatePhaseWorkOrder = new GraphQLInputObjectType({
	name: 'inputUpdatePhaseWorkOrder',
	description: 'Inputs for Phase Work Order Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...PhaseWorkOrderfields
	}
});

const inputUpdateHoliday = new GraphQLInputObjectType({
	name: 'inputUpdateHoliday',
	description: 'Inputs for Holiday Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...HolidayFields
	}
});

const inputUpdateEmployees = new GraphQLInputObjectType({
	name: 'inputUpdateEmployees',
	description: 'Inputs for Employees Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...EmployeesFields
	}
});

const inputUpdateShift = new GraphQLInputObjectType({
	name: 'inputUpdateShift',
	description: 'Inputs for Shift Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ShiftFields
	}
});

const inputUpdateShiftDetail = new GraphQLInputObjectType({
	name: 'inputUpdateShiftDetail',
	description: 'Inputs for Shift Detail Update',

	fields: {
		id: {
			type: GraphQLInt,
			description: 'table Id'
		},
		...ShiftDetailFields
	}
});


const inputUpdateMarkedEmployees = new GraphQLInputObjectType({
	name: 'inputUpdateMarkedEmployees',
	description: 'Inputs for Marked Employees Update',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...MarkedEmployeesFields
	}
});

const inputUpdateShiftDetailemployee = new GraphQLInputObjectType({
	name: 'inputUpdateShiftDetailemployee',
	description: 'Inputs for Shift Detail Employee',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...ShiftDetailEmployeesFields
	}
});

const inputUpdateRolesForms = new GraphQLInputObjectType({
	name: 'inputUpdateRolesForms',
	description: 'Inputs for Roles Forms',
	fields: {
		Id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'table Id'
		},
		...RolesFormsFields
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
	inputUpdateApplicantWorkerCompensation,
	inputUpdateApplicantDocument,
	inputUpdateWorkOrder,
	inputUpdateWorkOrderPosition,
	inputUpdateApplicantPhase,
	inputUpdatePhaseWorkOrder,
	inputUpdateHoliday,
	inputUpdateEmployees,
	inputUpdateShift,
	inputUpdateShiftDetail,
	inputUpdateShiftDetailemployee,
	inputUpdateMarkedEmployees,
	inputUpdateRolesForms,

};
