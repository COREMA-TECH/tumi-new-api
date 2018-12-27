import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLList } from 'graphql';

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
	PositionRateFields,
	CatalogItemFields,
	ApplicantDisclosureFields,
	ApplicantConductCodeFields,
	ApplicantBackgroundCheckFields,
	ApplicantHarassmentPoliciyFields,
	ApplicantWorkerCompensationFields,
	ApplicantDocumentFields,
	WorkOrderFields,
	WorkOrderPositionFields,
	ZipcodeFields,
	ApplicationPhaseFields,
	phaseworkOrderFields,
	usersFields,
	HolidayFields,
	EmployeesFields,
	ShiftFields,
	BusinessCompanyFields,
	ShiftDetailFields,
	ShiftWorkOrderFields,
	ShiftDetailEmployeesFields
} from '../fields';

const ApplicationType = new GraphQLObjectType({
	name: 'Applications',
	description: 'This is for application form',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Id'
			},
			...ApplicationFields,
			languages: {
				type: new GraphQLList(ApplicantLanguageType),
				resolve(application) {
					return application.getApplicantLanguages();
				}
			},
			educations: {
				type: new GraphQLList(ApplicantEducationType),
				resolve(application) {
					return application.getApplicantEducations();
				}
			},
			employments: {
				type: new GraphQLList(ApplicantPreviousEmploymentType),
				resolve(application) {
					return application.getApplicantPreviousEmployments();
				}
			},
			militaryServices: {
				type: new GraphQLList(ApplicantMilitaryServiceType),
				resolve(application) {
					return application.getApplicantMilitaryServices();
				}
			},
			skills: {
				type: new GraphQLList(ApplicantSkillType),
				resolve(application) {
					return application.getApplicantSkills();
				}
			},
			idealJobs: {
				type: new GraphQLList(ApplicantIdealJobType),
				resolve(application) {
					return application.getApplicantIdealJobs();
				}
			},
			position: {
				type: WorkOrderType, //CatalogItemType,
				resolve(application) {
					return application.getPositionApplyingFor();
				}
			},
			stateInfo: {
				type: CatalogItemType,
				resolve(application) {
					return application.getCatalogState();
				}
			},
			cityInfo: {
				type: CatalogItemType,
				resolve(application) {
					return application.getCatalogCity();
				}
			},
			disclosure: {
				type: ApplicantDisclosureType,
				resolve(application) {
					return application.getApplicantDisclosure();
				}
			},
			conductCode: {
				type: ApplicantConductCodeType,
				resolve(application) {
					return application.getApplicantConductCode();
				}
			},
			backgroundCheck: {
				type: ApplicantBackgroundCheckType,
				resolve(application) {
					return application.getApplicantBackgroundCheck();
				}
			},
			harassmentPolicy: {
				type: ApplicantHarassmentPolicyType,
				resolve(application) {
					return application.getApplicantHarassmentPolicy();
				}
			},
			workerCompensation: {
				type: ApplicantWorkerCompensationType,
				resolve(application) {
					return application.getApplicantWorkerCompensation();
				}
			},
			documents: {
				type: new GraphQLList(ApplicantDocumentType),
				resolve(application) {
					return application.getApplicantDocuments();
				}
			},
			applicationPhases: {
				type: new GraphQLList(ApplicationPhaseType),
				resolve(application) {
					return application.getApplicationPhases();
				}
			}
		};
	}
});

const ApplicantLanguageType = new GraphQLObjectType({
	name: 'ApplicantLanguages',
	description: 'This is for Applicant Languages Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Language Id'
			},
			...ApplicantLanguagesFields,
			application: {
				type: ApplicationType,
				resolve(applicantLanguage) {
					return applicantLanguage.getApplication();
				}
			}
		};
	}
});

const ApplicantEducationType = new GraphQLObjectType({
	name: 'ApplicantEducations',
	description: 'This is for Applicant Educations Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantEducationFields,
			application: {
				type: ApplicationType,
				resolve(applicantEducation) {
					return applicantEducation.getApplication();
				}
			}
		};
	}
});

const ApplicantPreviousEmploymentType = new GraphQLObjectType({
	name: 'ApplicantPreviousEmployment',
	description: 'This is for Applicant Employments Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantPreviousEmploymentFields,
			application: {
				type: ApplicationType,
				resolve(applicantPreviousEmployment) {
					return applicantPreviousEmployment.getApplication();
				}
			}
		};
	}
});
const ApplicantMilitaryServiceType = new GraphQLObjectType({
	name: 'ApplicantMilitaryService',
	description: 'This is for Applicant Military Service Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantMilitaryServiceFields,
			application: {
				type: ApplicationType,
				resolve(applicantMilitaryService) {
					return applicantMilitaryService.getApplication();
				}
			}
		};
	}
});

const ApplicantSkillType = new GraphQLObjectType({
	name: 'ApplicantSkillType',
	description: 'This is for Applicant Skills Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantSkillFields,
			application: {
				type: ApplicationType,
				resolve(applicantSkill) {
					return applicantSkill.getApplication();
				}
			}
		};
	}
});

const ApplicantIdealJobType = new GraphQLObjectType({
	name: 'ApplicantIdealJobType',
	description: 'This is for Applicant Ideal Job Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Ideal Job Id'
			},
			...ApplicantIdealJobFields,
			application: {
				type: ApplicationType,
				resolve(appIdealJob) {
					return appIdealJob.getApplication();
				}
			},
			position: {
				type: CatalogItemType,
				resolve(application) {
					return application.getCatalogPosition();
				}
			}
		};
	}
});

const CompanyPreferenceType = new GraphQLObjectType({
	name: 'CompanyPreferenceType',
	description: 'This is for Company Preference Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Company Preference Id'
			},
			...CompanyPreferenceFields
		};
	}
});

const ElectronicAddressType = new GraphQLObjectType({
	name: 'ElectronicAddress',
	description: 'This is for electronic address',
	fields: {
		Id: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		...ElectronicAddressFields
	}
});

const PositionRateType = new GraphQLObjectType({
	name: 'PositionRateType',
	description: 'This is for position rate item',
	fields: {
		Id: {
			type: GraphQLInt
		},
		...PositionRateFields
	}
});

const CatalogItemType = new GraphQLObjectType({
	name: 'CatalogItemType',
	description: 'This is for catalog item',
	fields: {
		Id: {
			type: GraphQLInt
		},
		...CatalogItemFields
	}
});

const UsersType = new GraphQLObjectType({
	name: 'UsersType',
	description: 'This is for Users',
	fields: {
		Id: {
			type: GraphQLInt
		},
		...usersFields
	}
});

const ApplicantDisclosureType = new GraphQLObjectType({
	name: 'ApplicantDisclosureType',
	description: 'This is for Application Disclosures',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'Disclosure Id'
			},
			...ApplicantDisclosureFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const ApplicantConductCodeType = new GraphQLObjectType({
	name: 'ApplicantConductCodeType',
	description: 'This is for Application Code of Conduct',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'Code of Conduct Id'
			},
			...ApplicantConductCodeFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const ApplicantBackgroundCheckType = new GraphQLObjectType({
	name: 'ApplicantBackgroundCheckType',
	description: 'This is for Applicant Background Check',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantBackgroundCheckFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});
const ApplicantHarassmentPolicyType = new GraphQLObjectType({
	name: 'ApplicantHarassmentPolicyType',
	description: 'This is for Applicant Harassment Policy',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantHarassmentPoliciyFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});
const ApplicantWorkerCompensationType = new GraphQLObjectType({
	name: 'ApplicantWorkerCompensationType',
	description: 'This is for Applicant Worker Compensation',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantWorkerCompensationFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});
const ApplicantDocumentType = new GraphQLObjectType({
	name: 'ApplicantDocumentType',
	description: 'This is for Applications Document',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantDocumentFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const WorkOrderType = new GraphQLObjectType({
	name: 'WorkOrderType',
	description: 'Output Type of Work Orders',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...WorkOrderFields,
			position: {
				type: PositionRateType,
				resolve(me) {
					return me.getPositionRate();
				}
			},
			workOrderPositions: {
				type: new GraphQLList(WorkOrderPositionType),
				resolve(me) {
					return me.getWorkOrderPositions();
				}
			},
			PhaseWorkOrder: {
				type: new GraphQLList(phaseworkOrderType),
				resolve(me) {
					return me.getphaseworkOrder();
				}
			},
			BusinessCompany: {
				type: BusinessCompanyType,
				resolve(me) {
					return me.getBusinessCompanyWO();
				}
			}

		};
	}
});

const WorkOrderPositionType = new GraphQLObjectType({
	name: 'WorkOrderPositionType',
	description: 'Output Type of Work Orders Positions',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...WorkOrderPositionFields,
			position: {
				type: PositionRateType,
				resolve(me) {
					return me.getPositionRate();
				}
			},
			workOrder: {
				type: WorkOrderType,
				resolve(me) {
					return me.getWorkOrder();
				}
			}
		};
	}
});

const ZipcodeType = new GraphQLObjectType({
	name: 'Zipcode',
	description: 'This is for Zipcode Table',
	fields: () => {
		return {
			...ZipcodeFields
		};
	}
});

const ApplicationPhaseType = new GraphQLObjectType({
	name: 'ApplicationPhase',
	description: 'This is for ApplicationPhase Table',
	fields: () => {

		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicationPhaseFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const phaseworkOrderType = new GraphQLObjectType({
	name: 'PhaseWorkOrder',
	description: 'This is for phaseworkOrder Table',
	fields: () => {
		return {
			...phaseworkOrderFields,
			actions: {
				type: CatalogItemType,
				resolve(me) {
					return me.getCatalogPhaseWO();
				}
			},
			users: {
				type: UsersType,
				resolve(me) {
					return me.getUsersWO();
				}
			},
		};
	}
});


const BusinessCompanyType = new GraphQLObjectType({
	name: 'BusinessCompany',
	description: 'This is for BusinessCompany Table',
	fields: () => {
		return {
			Id: {
				type: GraphQLInt
			},
			...BusinessCompanyFields
		}
	}
});

const HolidayType = new GraphQLObjectType({
	name: 'Holiday',
	description: 'This is for Holiday Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...HolidayFields
		}
	}
});

const EmployeesType = new GraphQLObjectType({
	name: 'Employees',
	description: 'This is for Employees Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...EmployeesFields
		}
	}
});

const ShiftType = new GraphQLObjectType({
	name: 'Shift',
	description: 'This is for Shift Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ShiftFields,
			company: {
				type: BusinessCompanyType,
				resolve(me) {
					return me.getShiftEntity();
				}
			}
		}
	}
});

const ShiftWorkOrderType = new GraphQLObjectType({
	name: 'ShiftWorkOrder',
	description: 'This is for Shift Table',
	fields: () => {
		return {
			...ShiftWorkOrderFields
		}
	}
});

const ShiftDetailEmployeesType = new GraphQLObjectType({
	name: 'ShiftDetailEmployee',
	description: 'This is for Shift Detail Employee Table',
	fields: () => {
		return {
			...ShiftDetailEmployeesFields
		}
	}
});

const ShiftDetailType = new GraphQLObjectType({
	name: 'ShiftDetail',
	description: 'This is for Shift Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ShiftDetailFields,
			shift: {
				type: ShiftType,
				resolve(me) {
					return me.getShift();
				}
			},
			detailEmployee: {
				type: ShiftDetailEmployeesType,
				resolve(me) {
					return me.getShiftDetailEmployee();
				}
			}
		}
	}
});

export {
	ApplicationType,
	ApplicantLanguageType,
	ElectronicAddressType,
	ApplicantEducationType,
	ApplicantPreviousEmploymentType,
	ApplicantMilitaryServiceType,
	ApplicantSkillType,
	CompanyPreferenceType,
	ApplicantIdealJobType,
	PositionRateType,
	CatalogItemType,
	UsersType,
	ApplicantDisclosureType,
	ApplicantConductCodeType,
	ApplicantBackgroundCheckType,
	ApplicantHarassmentPolicyType,
	ApplicantWorkerCompensationType,
	ApplicantDocumentType,
	WorkOrderType,
	WorkOrderPositionType,
	ZipcodeType,
	ApplicationPhaseType,
	phaseworkOrderType,
	HolidayType,
	EmployeesType,
	ShiftType,
	BusinessCompanyType,
	ShiftDetailType,
	ShiftWorkOrderType
};
