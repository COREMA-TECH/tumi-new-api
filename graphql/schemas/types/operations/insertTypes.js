import { GraphQLInputObjectType, GraphQLNonNull, GraphQLBoolean, GraphQLString, GraphQLInt, GraphQLList } from 'graphql';

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
	HolidayFields,
	EmployeesFields,
	ShiftFields,
	ShiftDetailFields,
	ShiftWorkOrderFields,
	ShiftDetailEmployeesFields,
	MarkedEmployeesFields,
	ApplicationEmployeesFields,
	RolesFormsFields,
	CatalogItemFields,
	ConfigRegionsFields,
	UsersFields,
	ContactsFields,
} from '../fields';

const inputInsertEmployees = new GraphQLInputObjectType({
	name: 'inputInsertEmployees',
	description: 'Inputs for employees Mutation',

	fields: {
		...EmployeesFields
	}
});

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
const inputInsertHoliday = new GraphQLInputObjectType({
	name: 'inputInsertHoliday',
	description: 'Inputs for Holiday Insert',

	fields: {
		...HolidayFields
	}
});

const inputInsertRolesForms = new GraphQLInputObjectType({
	name: 'inputInsertRolesForms',
	description: 'Inputs for Roles Forms Insert',

	fields: {
		...RolesFormsFields
	}
});

const inputInsertShift = new GraphQLInputObjectType({
	name: 'inputInsertShift',
	description: 'Inputs for Shift Insert',

	fields: {
		...ShiftFields
	}
});

const inputInsertShiftDetail = new GraphQLInputObjectType({
	name: 'inputInsertShiftDetail',
	description: 'Inputs for Shift Details Insert',
	fields: { ...ShiftDetailFields }

});

const inputInsertShiftWorkOrder = new GraphQLInputObjectType({
	name: 'inputInsertShiftWorkOrder',
	description: 'Inputs for Shift WorkOrder Insert',
	fields: { ...ShiftWorkOrderFields }

});

const inputInsertShiftDetailTransaction = new GraphQLInputObjectType({
	name: 'inputInsertShiftDetailTransaction',
	description: 'Inputs used to create Header/Detail for Shifts',

	fields: () => {
		let object = { ...ShiftDetailFields }
		delete object.ShiftId;
		return object;
	}
});

const inputInsertShiftDetailEmployee = new GraphQLInputObjectType({
	name: 'inputInsertShiftDetailEmployee',
	description: 'Inputs for Shift Detail Employee Insert',
	fields: { ...ShiftDetailEmployeesFields }

});

const inputInsertMarkedEmployees = new GraphQLInputObjectType({
	name: 'inputInsertMarkedEmployees',
	description: 'Inputs for MarkedEmployees Employee Insert',
	fields: { ...MarkedEmployeesFields }

});


const inputInsertApplicationEmployees = new GraphQLInputObjectType({
	name: 'inputInsertApplicationEmployees',
	description: 'Inputs for MarkedEmployees Employee Insert',
	fields: { ...ApplicationEmployeesFields }

});

const inputInsertCatalogItem = new GraphQLInputObjectType({
	name: 'inputInsertCatalogItem',
	description: 'Inputs for Catalog Items Employee Insert',
	fields: { ...CatalogItemFields }

});

const inputParamWorkOrderForShift = new GraphQLInputObjectType({
	name: 'inputParamWorkOrderForShift',
	description: "Input for Shift Creation",
	fields: {
		needExperience: { type: new GraphQLNonNull(GraphQLBoolean) },
		needEnglish: { type: new GraphQLNonNull(GraphQLBoolean) },
		comment: { type: new GraphQLNonNull(GraphQLString) },
		specialComment: { type: new GraphQLNonNull(GraphQLString) },
		userId: { type: new GraphQLNonNull(GraphQLInt) },
		notify: { type: new GraphQLNonNull(GraphQLInt) },
		requestedBy: { type: new GraphQLNonNull(GraphQLInt) }
	}
})

const inputShiftDetailQuery = new GraphQLInputObjectType({
	name: 'inputShiftDetailQuery',
	description: 'Inputs ShiftDetail query',
	fields: {
		id: { type: GraphQLInt },
		ShiftId: { type: GraphQLInt }
	}

});

const inputShiftDetailEmployeeQuery = new GraphQLInputObjectType({
	name: 'inputShiftDetailEmployeeQuery',
	description: 'Inputs ShiftDetailEmployee query',
	fields: {
		EmployeeId: { type: GraphQLInt }
	}

});

const inputShiftQuery = new GraphQLInputObjectType({
	name: 'inputShiftQuery',
	description: 'Inputs Shift query',
	fields: {
		id: { type: GraphQLInt },
		isTemplate: { type: GraphQLBoolean, defaultValue: false },
		isActive: { type: GraphQLBoolean, defaultValue: true },
		entityId: { type: GraphQLInt },
		departmentId: { type: GraphQLInt },
		status: { type: new GraphQLList(GraphQLInt) }
	}

});

const inputInsertConfigRegions = new GraphQLInputObjectType({
	name: 'inputConfigRegionsQuery',
	description: 'Inputs for configRegions Insert',
	fields: { ...ConfigRegionsFields }
});

const inputInsertUser = new GraphQLInputObjectType({
	name: 'inputInsertUser',
	description: 'Inputs to Insert User',
	fields: { ...UsersFields }
});

const inputShiftBoardCompany = new GraphQLInputObjectType({
	name: 'inputShiftBoardCompany',
	description: "Input for Shift",
	fields: {
		Id: { type: GraphQLInt },
		State: { type: GraphQLInt },
		City: { type: GraphQLInt }
	}
})

const filterShiftConvertToOpening = new GraphQLInputObjectType({
	name: 'filterShiftConvertToOpening',
	description: "Input to Create a Shift as Work Order [status:1] into Openening",
	fields: () => {
		return {
			id: { type: GraphQLInt }
		}
	}
})

const filterShiftWOConvertToOpening = new GraphQLInputObjectType({
	name: 'filterShiftWOConvertToOpening',
	description: "Input to Create a Shift as Work Order [status:1] into Openening",
	fields: () => {
		return {
			WorkOrderId: { type: GraphQLInt }
		}
	}
})

const inputInsertContact = new GraphQLInputObjectType({
	name: 'inputContact',
	description: 'Insert Contacts',
	fields: { ...ContactsFields }
})

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
	inputInsertHoliday,
	inputInsertEmployees,
	inputInsertShift,
	inputInsertShiftDetail,
	inputInsertShiftDetailTransaction,
	inputInsertShiftWorkOrder,
	inputInsertShiftDetailEmployee,
	inputParamWorkOrderForShift,
	inputInsertMarkedEmployees,
	inputInsertApplicationEmployees,
	inputInsertRolesForms,
	inputInsertCatalogItem,
	inputShiftDetailQuery,
	inputShiftDetailEmployeeQuery,
	inputShiftQuery,
	inputInsertConfigRegions,
	inputInsertUser,
	inputShiftBoardCompany,
	filterShiftConvertToOpening,
	filterShiftWOConvertToOpening,
	inputInsertContact,
};
