import {
	GraphQLInt,
	GraphQLString,
	GraphQLNonNull,
	GraphQLObjectType,
	GraphQLList,
	GraphQLBoolean,
	GraphQLInputObjectType,
	GraphQLFloat
} from 'graphql';
import GraphQLDate from 'graphql-date';
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
	ApplicantW4Fields,
	ApplicantI9Fields,
	WorkOrderFields,
	WorkOrderPositionFields,
	ZipcodeFields,
	CoordenadasFields,
	ApplicationPhaseFields,
	phaseworkOrderFields,
	UsersFields,
	HolidayFields,
	EmployeesFields,
	ShiftFields,
	BusinessCompanyFields,
	ShiftDetailFields,
	ShiftWorkOrderFields,
	ShiftDetailEmployeesFields,
	MarkedEmployeesFields,
	ApplicationEmployeesFields,
	ContactsFields,
	RolesFields,
	FormsFields,
	RolesFormsFields,
	ConfigRegionsFields,
	consolidatedPunchesCSVTypes,
	openingRecruiterFields,
	SmsLogFields,
	ApplicantIndependentContractFields,
	BreakRuleFields,
	BreakRuleDetailFields,
	Employee_BreakRuleFields,
	TransactionLogFields
} from '../fields';

import Db from '../../../models/models';
import payrollFields from "../fields/payrollFields";

const ApplicationType = new GraphQLObjectType({
	name: 'Applications',
	description: 'This is for application form',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Id'
			},
			codeuser: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Code User'
			},
			nameUser: {
				type: new GraphQLNonNull(GraphQLString),
				description: 'Name User'
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
			Phases: {
				type: new GraphQLList(ApplicationPhaseType),
				resolve(application) {
					return application.getApplicationPhases();
				}
			},
			Coordenadas: {
				type: CoordenadasType,
				resolve(application) {
					return application.getCoordenadas();
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
			employee: {
				type: ApplicationEmployeesType,
				resolve(me) {
					return me.getApplicationEmployee();
				}
			},
			recruiter: {
				type: UsersType,
				resolve(me) {
					return me.getRecruiter();
				}
			},
			user: {
				type: UsersType,
				resolve(me) {
					return me.getUser();
				}
			},
			independentContract: {
				type: ApplicantIndepenentContractType,
				resolve(me) {
					return me.getApplicantIndependentContract();
				}
			},
			statusCompleted: {
				type: GraphQLBoolean,
				resolve(me) {
					return Db.models.Applications.findOne({
						where: { id: me.id },
						include: [{
							model: Db.models.ApplicantBackgroundChecks,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantDisclosures,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantConductCodes,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantHarassmentPolicy,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantWorkerCompensation,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantW4,
							where: { completed: true },
							required: true
						}, {
							model: Db.models.ApplicantI9,
							where: { completed: true },
							required: true
						}]
					})
						.then(_application => {
							return _application != null; //Return true when all record associated to this application are completed
						})

				}
			}
		};
	}
});

const Employee_BreakRuleType = new GraphQLObjectType({
	name: "Employee_BreakRuleType",
	description: 'Links employees to break rules',
	fields: _ => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'employee and break rule link'
			},
			...Employee_BreakRuleFields,
			employees: {
				type: EmployeesType,
				resolve(me) {
					return me.getEmployee();
				}
			}
		}
	}
})

const BreakRuleType = new GraphQLObjectType({
	name: 'BreakRuleType',
	description: 'Break Rules table',
	fields: _ => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Break rule id'
			},
			...BreakRuleFields,
			breakRuleDetail: {
				type: BreakRuleDetailType,
				resolve(me) {
					return me.getBreakRuleDetail();
				}
			},
			businessCompany: {
				type: BusinessCompanyType,
				resolve(breakRule) {
					return breakRule.getBusinessCompany();
				}
			},
			employee_BreakRule: {
				type: new GraphQLList(Employee_BreakRuleType),
				resolve(me) {
					return me.getEmployee_BreakRules();
				}
			}			
		}
	}
});

const BreakRuleDetailType = new GraphQLObjectType({
	name: 'BreakRuleDetailType',
	description: 'Break rule detail when a break rule is set to automatic',
	fields: _ => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Break rule detail'
			},
			...BreakRuleDetailFields,
			breakRule: {
				type: BreakRuleType,
				resolve(breakRuleDetail) {
					return breakRuleDetail.getBreakRule();
				}
			}
		}
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
	fields: () => {
		return {
			Id: {
				type: GraphQLInt
			},
			...CatalogItemFields,
			contacts: {
				type: new GraphQLList(ContactsType),
				resolve(me) {
					return me.getContacts();
				}
			}
		}
	}
});

const UsersType = new GraphQLObjectType({
	name: 'UsersType',
	description: 'This is for Users',
	fields: () => {
		return {
			Id: {
				type: GraphQLInt
			},
			...UsersFields,
			role: {
				type: RolesType,
				resolve(me) {
					return me.getRole();
				}
			},
			language: {
				type: CatalogItemType,
				resolve(me) {
					return me.getLanguage();
				}

			}
		}
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

const ApplicantW4Type = new GraphQLObjectType({
	name: 'ApplicantW4Type',
	description: 'This is for Applications W4',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantW4Fields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const ApplicantI9Type = new GraphQLObjectType({
	name: 'ApplicantI9Type',
	description: 'This is for Applications I9',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantI9Fields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const ApplicantIndepenentContractType = new GraphQLObjectType({
	name: 'ApplicantIndepenentContractType',
	description: 'This is for Applications Independent Contract',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicantIndependentContractFields,
			application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			}
		};
	}
});

const ApplicationCompletedDataType = new GraphQLObjectType({
	name: 'ApplicationCompletedData',
	description: 'Returns the state of all tables related to the applicant.',
	fields: () => {
		return {
			ApplicantBackgroundCheck: {
				type: GraphQLBoolean
			},
			ApplicantDisclosure: {
				type: GraphQLBoolean
			},
			ApplicantConductCode: {
				type: GraphQLBoolean
			},
			ApplicantHarassmentPolicy: {
				type: GraphQLBoolean
			},
			ApplicantWorkerCompensation: {
				type: GraphQLBoolean
			},
			ApplicantW4: {
				type: GraphQLBoolean
			},
			ApplicantI9: {
				type: GraphQLBoolean
			}
		}
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

const CoordenadasType = new GraphQLObjectType({
	name: 'Coordenadas',
	description: 'This is for Coordenadas Table',
	fields: () => {
		return {
			...CoordenadasFields
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
			},
			shift: {
				type: ShiftType,
				resolve(me) {
					return me.getShift();
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

const ContactsType = new GraphQLObjectType({
	name: 'Contacts',
	description: 'This is for Contacts Table',
	fields: () => {
		return {
			Id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ContactsFields
		}
	}
});

const RolesType = new GraphQLObjectType({
	name: 'Roles',
	description: 'This is for Roles Table',
	fields: () => {
		return {
			Id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...RolesFields
		}
	}
});

const FormsType = new GraphQLObjectType({
	name: 'Forms',
	description: 'This is for Forms Table',
	fields: () => {
		return {
			Id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...FormsFields
		}
	}
});

const TimeElapsedType = new GraphQLObjectType({
	name: 'TimeElapsed',
	description: 'This is for Time Elapsed',
	fields: () => {
		return {

			Full_Name: {
				type: GraphQLString,
				description: 'table Full_Name'
			},
			TimeElapsed: {
				type: GraphQLString,
				description: 'table TimeElapsed'
			},
			RecruiterId: {
				type: GraphQLInt,
				description: 'table RecruiterId'
			},
			WorkOrderId: {
				type: GraphQLInt,
				description: 'table WorkOrderId'
			},
			ShiftId: {
				type: GraphQLInt,
				description: 'table ShiftId'
			},

		}
	}
});

const RolesFormsType = new GraphQLObjectType({
	name: 'RolesForms',
	description: 'This is for RolesForms Table',
	fields: () => {
		return {
			...RolesFormsFields,
			Roles: {
				type: RolesType,
				resolve(me) {
					return me.getRoles();
				}
			},
			Forms: {
				type: FormsType,
				resolve(me) {
					return me.getForms();
				}
			},
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
			...EmployeesFields,
			ApplicationEmployees: {
				type: ApplicationEmployeesType,
				resolve(me) {
					return me.getApplicationEmployee();
				}
			},
			Deparment: {
				type: CatalogItemType,
				resolve(me) {
					return me.getCatalogDepartment();
				}
			},
			ShiftDetailEmployee: {
				type: new GraphQLList(ShiftDetailEmployeesType),
				resolve(me) {
					return me.getShiftDetailEmployees()
				}
			},
			BusinessCompany: {
				type: BusinessCompanyType,
				resolve(me) {
					return me.getBusinessCompany()
				}
			}
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
			},
			workOrder: {
				type: ShiftWorkOrderType,
				resolve(me) {
					return me.getShiftWorkOrder();
				}
			},
			position: {
				type: PositionRateType,
				resolve(me) {
					return me.getCatalogPosition();
				}
			}
		}
	}
});

const ShiftBoardType = new GraphQLObjectType({
	name: 'ShiftBoardType',
	description: 'This is for Shift Board :v',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			title: {
				type: GraphQLString,
				description: 'table title'
			},
			quantity: {
				type: GraphQLInt,
				description: 'table quantity'
			},
			workOrderId: {
				type: GraphQLInt,
				description: 'table workOrderId'
			},
			CompanyName: {
				type: GraphQLString,
				description: 'table CompanyName'
			},
			needExperience: {
				type: GraphQLBoolean,
				description: 'table NeedExperience'
			},
			needEnglish: {
				type: GraphQLBoolean,
				description: 'table Need English'
			},
			zipCode: {
				type: GraphQLString,
				description: 'table zip code'
			},
			Id_positionApplying: {
				type: GraphQLInt,
				description: "table Posisition Appliying Id"
			},
			positionName: {
				type: GraphQLString,
				description: "table Position's Name"
			},
			status: {
				type: GraphQLInt,
				description: "table Position's Name"
			},
			isOpening: {
				type: GraphQLInt,
				description: "IsOpening"
			},
			shift: {
				type: GraphQLString,
				description: "table shift"
			},
			endShift: {
				type: GraphQLString,
				description: "table endShift"
			},
			count: {
				type: GraphQLInt,
				description: "table count"
			},
			startDate: {
				type: GraphQLDate,
				description: "table startDate"
			},
			endDate: {
				type: GraphQLDate,
				description: "table endDate"
			},
			date: {
				type: GraphQLDate,
				description: "table date"
			},
			comment: {
				type: GraphQLString,
				description: "table comment"
			},
			EspecialComment: {
				type: GraphQLString,
				description: "table EspecialComment"
			},
			dayWeek: {
				type: GraphQLString,
				description: "table dayWeek"
			},
			IdEntity: {
				type: GraphQLInt,
				description: "table IdEntity"
			},
			contactId: {
				type: GraphQLInt,
				description: "table contactId"
			},
			PositionRateId: {
				type: GraphQLInt,
				description: "table PositionRateId"
			},
			OpeningRecruiter: {
				type: new GraphQLList(listOpeningRecruiterQuery),
				description: "Opening Recruiter"
			},
			Users: {
				type: new GraphQLList(UsersType),
				description: "Opening Recruiter"
			},
			departmentId: {
				type: GraphQLInt,
				description: "Department Id"
			},
		}
	}
});


const ShiftWorkOrderType = new GraphQLObjectType({
	name: 'ShiftWorkOrder',
	description: 'This is for Shift Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ShiftWorkOrderFields,
			workOrder: {
				type: WorkOrderType,
				resolve(me) {
					return me.getWorkOrder();
				}
			},
			shift: {
				type: ShiftType,
				resolve(me) {
					return me.getShift();
				}
			}
		}
	}
});

const ShiftDetailEmployeesType = new GraphQLObjectType({
	name: 'ShiftDetailEmployee',
	description: 'This is for Shift Detail Employee Table',
	fields: () => {
		return {
			...ShiftDetailEmployeesFields,
			Employees: {
				type: EmployeesType,
				resolve(me) {
					return me.getEmployees();
				}
			},
			ShiftDetail: {
				type: ShiftDetailType,
				resolve(me) {
					return me.getShiftDetail();
				}
			}
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

const TemplateType = new GraphQLObjectType({
	name: 'TemplateType',
	description: 'This is for Tenplate Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			title: {
				type: GraphQLString
			}
		}
	}
});

const MarkedEmployeesType = new GraphQLObjectType({
	name: 'MarkedEmployees',
	description: 'This is for Marked Employees Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...MarkedEmployeesFields,
			Employees: {
				type: EmployeesType,
				resolve(me) {
					return me.getEmployees();
				}
			},
			TypeMarked: {
				type: CatalogItemType,
				resolve(me) {
					return me.getCatalogMarked();
				}
			},
		}
	}
});

const PunchesReportType = new GraphQLObjectType({
	name: 'PunchesReportType',
	description: 'This structured is used to generate report about punches',
	fields: () => {
		return {
			employeeId: { type: GraphQLInt },
			name: { type: GraphQLString },
			hourCategory: { type: GraphQLString },
			hoursWorked: { type: GraphQLFloat },
			payRate: { type: GraphQLFloat },
			date: { type: GraphQLString },
			clockIn: { type: GraphQLString },
			clockOut: { type: GraphQLString },
			lunchIn: { type: GraphQLString },
			lunchOut: { type: GraphQLString },
			hotelCode: { type: GraphQLString },
			positionCode: { type: GraphQLString },
			imageMarkedIn: { type: GraphQLString },
			imageMarkedOut: { type: GraphQLString },
			flagMarkedIn: { type: GraphQLBoolean },
			flagMarkedOut: { type: GraphQLBoolean },
			idMarkedIn: { type: GraphQLInt },
			idMarkedOut: { type: GraphQLInt }
		}
	}
})

const PunchesReportDetailType = new GraphQLObjectType({
	name: 'PunchesReportDetailType',
	description: 'This structured is used to generate report detail about punches',
	fields: () => {
		return {
			key: { type: GraphQLString },
			employeeId: { type: GraphQLInt },
			name: { type: GraphQLString },
			date: { type: GraphQLString },
			punches: { type: new GraphQLList(PunchesReportDetailPunchesType) },
			workedHours: { type: GraphQLFloat }
		}
	}
})

const PunchesReportDetailPunchesType = new GraphQLObjectType({
	name: 'PunchesReportDetailPunchesType',
	description: 'This structured is used to generate report detail about punches',
	fields: () => {
		return {
			clockIn: { type: GraphQLString },
			clockOut: { type: GraphQLString },
			duration: { type: GraphQLFloat },
			job: { type: GraphQLString },
			hotelCode: { type: GraphQLString },
			notes: { type: GraphQLString }
		}
	}
})


const PunchesReportConsolidateType = new GraphQLObjectType({
	name: 'PunchesReportConsolidateType',
	description: 'This structured is used to generate report consolidated about punches',
	fields: () => {
		return {
			key: { type: GraphQLString },
			date: { type: GraphQLString },
			punches: { type: new GraphQLList(PunchesReportConsolidatedPunchesType) }
		}
	}
})

const PunchesEmployeeReportConsolidateType = new GraphQLObjectType({
	name: 'PunchesEmployeeReportConsolidateType',
	description: 'This structured is used to generate report consolidated about punches',
	fields: () => {
		return {
			key: { type: GraphQLString },
			employeeId: { type: GraphQLInt },
			name: { type: GraphQLString },
			date: { type: GraphQLString },
			punches: { type: new GraphQLList(PunchesReportConsolidateDetailType) },
			workedHours: { type: GraphQLFloat }
		}
	}
})

const PunchesReportConsolidateDetailType = new GraphQLObjectType({
	name: 'PunchesReportConsolidateDetailType',
	description: 'This structured is used to generate report consolidated about punches',
	fields: () => {
		return {
			clockIn: { type: GraphQLString },
			clockOut: { type: GraphQLString },
			duration: { type: GraphQLFloat },
			job: { type: GraphQLString },
			hotelCode: { type: GraphQLString },
			notes: { type: GraphQLString }
		}
	}
})

const PunchesReportConsolidatedPunchesType = new GraphQLObjectType({
	name: 'PunchesReportConsolidatedPunchesType',
	description: 'This structured is used to generate report consolidated about punches',
	fields: () => {
		return {
			key: { type: GraphQLString },
			name: { type: GraphQLString },
			employeeId: { type: GraphQLInt },
			clockIn: { type: GraphQLString },
			clockOut: { type: GraphQLString },
			imageMarkedIn: { type: GraphQLString },
			imageMarkedOut: { type: GraphQLString },
			duration: { type: GraphQLFloat },
			job: { type: GraphQLString },
			hotelCode: { type: GraphQLString }
		}
	}
})

const ApplicationEmployeesType = new GraphQLObjectType({
	name: 'ApplicationEmployees',
	description: 'This is for Marked Employees Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ApplicationEmployeesFields,
			Employees: {
				type: EmployeesType,
				resolve(me) {
					return me.getEmployees();
				}
			},
			Application: {
				type: ApplicationType,
				resolve(me) {
					return me.getApplication();
				}
			},

		}
	}
});

const ConfigRegionsType = new GraphQLObjectType({
	name: 'ConfigRegions',
	description: 'This is for Config Regions Table',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
				description: 'table id'
			},
			...ConfigRegionsFields
		}
	}
});

// Type to use in payroll mutation and query
const listPayrollType = new GraphQLObjectType({
	name: 'payroll',
	description: 'This represent a payroll',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
			},
			...payrollFields
		}
	}
});

// Type to use in Transaction Logs
const transactionLogsTypes = new GraphQLObjectType({
	name: 'transactionLogs',
	description: 'This represent a all the transaction in system',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
			},
			...TransactionLogFields
		}
	}
});

// Type to use in payroll mutation and query
const getCSVURLType = new GraphQLObjectType({
	name: 'CSVUrl',
	description: 'This represent a url',
	fields: () => {
		return {
			...consolidatedPunchesCSVTypes
		}
	}
});

// Type to use in payroll mutation and query
const listOpeningRecruiterQuery = new GraphQLObjectType({
	name: 'OpeningRecruiter',
	description: 'This represent a opening recruiter list',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
			},
			...openingRecruiterFields,
			Users: {
				type: new GraphQLList(UsersType),
				description: "Opening Recruiter"
			},
		}
	}
});

const listOpeningRecruiterType = new GraphQLObjectType({
	name: 'listOpeningRecruiterType',
	description: 'This represent a opening recruiter list',
	fields: () => {
		return {
			id: {
				type: GraphQLInt,
			},
			...openingRecruiterFields
		}
	}
});

const SmsLogType = new GraphQLObjectType({
	name: 'SmsLogType',
	description: 'This object represents a Sms request',
	fields: () => {
		return {
			id: { type: GraphQLInt },
			...SmsLogFields
		}
	}
})

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
	ApplicantW4Type,
	ApplicantI9Type,
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
	ShiftWorkOrderType,
	ShiftDetailEmployeesType,
	MarkedEmployeesType,
	ApplicationEmployeesType,
	ContactsType,
	RolesType,
	FormsType,
	RolesFormsType,
	TemplateType,
	ConfigRegionsType,
	TimeElapsedType,
	ShiftBoardType,
	ApplicationCompletedDataType,
	listPayrollType,
	PunchesReportType,
	getCSVURLType,
	listOpeningRecruiterQuery,
	listOpeningRecruiterType,
	PunchesReportDetailType,
	SmsLogType,
	PunchesReportConsolidateType,
	CoordenadasType,
	PunchesEmployeeReportConsolidateType,
	ApplicantIndepenentContractType,
	BreakRuleType,
	BreakRuleDetailType,
	Employee_BreakRuleType,
	transactionLogsTypes
};
