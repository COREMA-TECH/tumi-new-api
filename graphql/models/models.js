import ApplicationModel from './applicationTable';
import ElectronicAddressModel from './electronicaddressTable';
import ApplicantLanaguageModel from './applicantLanguageTable';
import ApplicantEducationModel from './applicantEducationTable';
import ApplicantPreviousEmploymentModel from './applicantPreviousEmploymentTable';
import ApplicantMilitaryServicesModel from './applicantMilitaryServiceTable';
import ApplicantSkillTableModel from './applicantSkillTable';
import CompanyPreferencesModel from './companyPreferenceTable';
import ApplicantIdealJobsModel from './applicantIdealJobTable';
import ApplicantDisclosureModel from './applicantDisclosureTable';
import ApplicantConductCodeModel from './applicantConductCodeTable';
import ApplicantBackgroundCheckModel from './applicantBackgroundCheckTable';
import ApplicantHarassmentPolicyModel from './applicantHarassmentPolicyTable';
import ApplicantWorkerCompensationModel from './applicantWorkerCompensationTable';
import ApplicantDocumentModel from './applicantDocumentTable';
import ApplicantW4Model from './applicantW4Table';
import ApplicantI9Model from './applicantI9Table';
import TransactionLogModel from './transactionLogTable';

import WorkOrderModel from './workOrderTable';
import PositionRateModel from './positionRateTable';
import WorkOrderPositionModel from './workOrderPositionTable';
import ZipcodeModel from './zipcodeTable';
import ApplicationPhasesModel from './applicationPhases';
import phaseworkOrderModel from './phaseworkOrderTable';
import HolidayModel from './holidayTable';
import EmployeesModel from './employeesTable';

import ShiftModel from './shiftTable';
import ShiftDetailModel from './shiftDetailTable';
import ShiftDetailEmployeesModel from './ShiftDetailEmployeesTable';
import ShiftWorkOrderModel from './shiftWorkOrderTable';

import BusinessCompanyModel from './businessCompanyTable';
import ContactsModel from './contactsTable';
import RolesModel from './roleTable';
import FormsModel from './formTable';
import RolesFormsModel from './rolesformsTable';

import CatalogItemModel from './catalogItemTable';
import UsersModel from './UsersTable';

import MarkedEmployeesModel from './markedEmployeesTable';
import MarkedEmployeesTestModel from './markedEmployeesTestTable';
import MarkedEmployeesOldModel from './markedEmployeesTableOld';
import ApplicationEmployeesModel from './applicationEmployeesTable';

import TemplateModel from './templateTable';
import TemplateShiftModel from './templateShiftTable';

import ConfigRegionsModel from './configRegionsTable';
import SmsLogModel from './smsLogTable';

import { Conn } from '../../Configuration/Configuration';

import CoordenadasModel from './coordenadasTable';

import ApplicationAccountModel from './applicationAccount';
import ApplicationAccountDocumentsModel from './applicationAccountDocuments';
import ApplicantLegalDocumentModel from './applicantLegalDocumentTable';

// OpeningRecruiter
import OpeningRecruiterModel from './openingrecruiterModel';

//Break Rules
import BreakRule from './breakRule';
import BreakRuleDetail from './breakRuleDetail';
import Employee_BreakRuleModel from './employee_breakRuleTable';
import ApplicantIndependentContractModel from './applicantIndependentContractTable';
import VisitModel from './visitTable';
import ApplicantVerificationLetterModel from './applicantVerificationLetterTable';
import EmployeeByHotelModel from './employeeByHotelTable';
import FeatureModel from './featureTable';
import ContractModel from './contractTable';
import TokenModel from './tokenTable';
import BusinessRuleModel from './businessRule';
import RegionsUsersModel from './regionsUsersTable';
import ApplicationDocumentTypeModel from './applicationDocumentTypeTable';

const BreakRuleModel = BreakRule.createModel(Conn);
const BreakRuleDetailModel = BreakRuleDetail.createModel(Conn);
const Application = ApplicationModel.createModel(Conn);
const ApplicantLanguage = ApplicantLanaguageModel.createModel(Conn);
const ApplicantEducation = ApplicantEducationModel.createModel(Conn);
const ApplicantPreviousEmployment = ApplicantPreviousEmploymentModel.createModel(Conn);
const ApplicantMilitaryServices = ApplicantMilitaryServicesModel.createModel(Conn);
const ApplicantSkill = ApplicantSkillTableModel.createModel(Conn);
const ApplicantIdealJob = ApplicantIdealJobsModel.createModel(Conn);
const ApplicantDisclosure = ApplicantDisclosureModel.createModel(Conn);
const ApplicantConductCode = ApplicantConductCodeModel.createModel(Conn);
const ApplicantBackgroundCheck = ApplicantBackgroundCheckModel.createModel(Conn);
const ApplicantHarassmentPolicy = ApplicantHarassmentPolicyModel.createModel(Conn);
const ApplicantWorkerCompensation = ApplicantWorkerCompensationModel.createModel(Conn);
const ApplicantDocument = ApplicantDocumentModel.createModel(Conn);
const ApplicantW4 = ApplicantW4Model.createModel(Conn);
const ApplicantI9 = ApplicantI9Model.createModel(Conn);
const WorkOrder = WorkOrderModel.createModel(Conn);
const WorkOrderPosition = WorkOrderPositionModel.createModel(Conn);
const ApplicationAccountDocument = ApplicationAccountDocumentsModel.createModel(Conn);

const TransactionLog = TransactionLogModel.createModel(Conn);

const ElectronicAddress = ElectronicAddressModel.createModel(Conn);
const CompanyPreference = CompanyPreferencesModel.createModel(Conn);
const CatalogItem = CatalogItemModel.createModel(Conn);
const Users = UsersModel.createModel(Conn);
const PositionRate = PositionRateModel.createModel(Conn);
const Holiday = HolidayModel.createModel(Conn);

const phaseworkOrder = phaseworkOrderModel.createModel(Conn);

const BusinessCompany = BusinessCompanyModel.createModel(Conn)
const Contacts = ContactsModel.createModel(Conn);
const Roles = RolesModel.createModel(Conn);
const Forms = FormsModel.createModel(Conn);
const RolesForms = RolesFormsModel.createModel(Conn);

const Zipcode = ZipcodeModel.createModel(Conn);
Zipcode.removeAttribute('id');

const Coordenadas = CoordenadasModel.createModel(Conn);

const Employees = EmployeesModel.createModel(Conn);
const Shift = ShiftModel.createModel(Conn);
const ShiftDetail = ShiftDetailModel.createModel(Conn);
const ShiftDetailEmployees = ShiftDetailEmployeesModel.createModel(Conn);
const ShiftWorkOrder = ShiftWorkOrderModel.createModel(Conn);

const MarkedEmployees = MarkedEmployeesModel.createModel(Conn);
const MarkedEmployeesTest = MarkedEmployeesTestModel.createModel(Conn);
const MarkedEmployeesOld = MarkedEmployeesOldModel.createModel(Conn);
const ApplicationEmployees = ApplicationEmployeesModel.createModel(Conn);
const ApplicationPhases = ApplicationPhasesModel.createModel(Conn);

const Template = TemplateModel.createModel(Conn);
const TemplateShift = TemplateShiftModel.createModel(Conn);


const OpeningRecruiter = OpeningRecruiterModel.createModel(Conn);

const ConfigRegions = ConfigRegionsModel.createModel(Conn);
const SmsLog = SmsLogModel.createModel(Conn);
const ApplicationAccount = ApplicationAccountModel.createModel(Conn);

const Employee_BreakRule = Employee_BreakRuleModel.createModel(Conn);
const ApplicantIndependentContract = ApplicantIndependentContractModel.createModel(Conn);
const Visit = VisitModel.createModel(Conn);
const EmployeeByHotel = EmployeeByHotelModel.createModel(Conn);
const ApplicantVerificationLetter = ApplicantVerificationLetterModel.createModel(Conn);
const Feature = FeatureModel.createModel(Conn);
const Contracts = ContractModel.createModel(Conn);
const Tokens = TokenModel.createModel(Conn);
const BusinessRule = BusinessRuleModel.createModel(Conn);
const ApplicationDocumentType = ApplicationDocumentTypeModel.createModel(Conn);
const ApplicantLegalDocumentType = ApplicantLegalDocumentModel.createModel(Conn);

ApplicantLegalDocumentType.belongsTo(ApplicationDocumentType);
ApplicantLegalDocumentType.belongsTo(Application);

BusinessRule.belongsTo(CatalogItem, {
	foreignKey: "catalogItemId",
	as: "RuleType"
});

CatalogItem.hasMany(BusinessRule, {
	foreignKey: "catalogItemId",
});
const RegionsUsers = RegionsUsersModel.createModel(Conn);

ApplicationPhases.belongsTo(CatalogItem, {
	foreignKey: 'ReasonId',
	as: 'Reason'
});

ApplicationPhases.belongsTo(WorkOrder, {
	foreignKey: 'WorkOrderId',
	as: 'WorkOrder'
})

ApplicationPhases.belongsTo(Shift, {
	foreignKey: 'ShiftId',
	as: 'Shift'
});

Application.hasMany(ApplicationPhases);
Application.hasMany(ApplicantLanguage);
Application.hasMany(ApplicantEducation);
Application.hasMany(ApplicantPreviousEmployment);
Application.hasMany(ApplicantMilitaryServices);
Application.hasMany(ApplicantSkill);
Application.hasMany(ApplicantIdealJob);
Application.hasMany(ApplicantDocument);

Application.hasOne(ApplicantDisclosure);
Application.hasOne(ApplicantConductCode);
Application.hasOne(ApplicantBackgroundCheck);
Application.hasOne(ApplicantHarassmentPolicy);
Application.hasOne(ApplicantWorkerCompensation);
Application.hasOne(ApplicantW4);
Application.hasOne(ApplicantI9);
Application.hasOne(ApplicantIndependentContract);
Application.hasOne(ApplicationAccount);
Application.hasOne(ApplicantVerificationLetter);

Application.belongsToMany(Employees, { through: 'ApplicationEmployees' });
Employees.belongsToMany(Application, { through: 'ApplicationEmployees' });

ApplicationPhases.belongsTo(Application);
ApplicantLanguage.belongsTo(Application);
ApplicantEducation.belongsTo(Application);
ApplicantPreviousEmployment.belongsTo(Application);
ApplicantMilitaryServices.belongsTo(Application);
ApplicantSkill.belongsTo(Application);
ApplicantIdealJob.belongsTo(Application);
ApplicantDocument.belongsTo(Application);
ApplicantDocument.belongsTo(CatalogItem);
ApplicantIndependentContract.belongsTo(Application);
ApplicantVerificationLetter.belongsTo(Application);

ApplicantW4.belongsTo(Application);
ApplicantI9.belongsTo(Application);

ApplicantIdealJob.belongsTo(CatalogItem, {
	foreignKey: 'idPosition',
	as: 'CatalogPosition'
});

ApplicantDisclosure.belongsTo(Application);
ApplicantConductCode.belongsTo(Application);
ApplicantBackgroundCheck.belongsTo(Application);
ApplicantHarassmentPolicy.belongsTo(Application);
ApplicantWorkerCompensation.belongsTo(Application);

ApplicationAccount.belongsTo(Application);
Application.hasMany(ApplicationAccount, {
	foreignKey: 'applicationId'
});

ApplicationAccountDocument.belongsTo(ApplicationAccount, {
	foreignKey: 'applicationAccountId'
});

ApplicationAccount.hasMany(ApplicationAccountDocument, {
	foreignKey: 'applicationAccountId'
});

WorkOrder.belongsTo(PositionRate);
PositionRate.hasMany(WorkOrder);

WorkOrder.belongsTo(BusinessCompany, {
	foreignKey: 'IdEntity',
	as: 'BusinessCompanyWO'
});


WorkOrder.hasMany(WorkOrderPosition, { onDelete: 'cascade' });
WorkOrderPosition.belongsTo(PositionRate);

PositionRate.belongsTo(CatalogItem, {
	foreignKey: 'Id_Department',
	as: 'Department'
});

WorkOrder.hasMany(phaseworkOrder);
phaseworkOrder.belongsTo(WorkOrder);

phaseworkOrder.belongsTo(CatalogItem, {
	foreignKey: 'phaseworkOrderId',
	as: 'CatalogPhaseWO'
});

phaseworkOrder.belongsTo(Users, {
	foreignKey: 'userId',
	as: 'UsersWO'
});

Application.belongsTo(WorkOrder, {
	foreignKey: 'positionApplyingFor',
	as: 'PositionApplyingFor'
});

Application.belongsTo(CatalogItem, {
	foreignKey: 'state',
	as: 'CatalogState'
});

Application.belongsTo(CatalogItem, {
	foreignKey: 'city',
	as: 'CatalogCity'
});

Application.belongsTo(Coordenadas, {
	foreignKey: 'zipCode',
	as: 'Coordenadas'
});

Application.belongsTo(Users, {
	foreignKey: 'idRecruiter',
	as: "Recruiter"
});

Application.belongsTo(Users, {
	foreignKey: 'UserId',
	as: "User"
})

Shift.belongsTo(PositionRate, {
	foreignKey: 'idPosition',
	as: 'CatalogPosition'
});

Users.belongsTo(Roles, {
	foreignKey: 'Id_Roles',
	as: 'Role'
});

Users.belongsTo(CatalogItem, {
	foreignKey: 'Id_Language',
	as: 'Language'
});

Contacts.hasMany(Users, {
	foreignKey: 'Id_Contact',
	as: 'Users'
});

Users.belongsTo(Contacts, {
	foreignKey: 'Id_Contact',
	as: 'Contact'
});

Forms.hasMany(RolesForms, { foreignKey: 'IdForms' });

RolesForms.belongsTo(Forms, {
	foreignKey: 'IdForms',
	as: 'Forms'
})

RolesForms.belongsTo(Roles, {
	foreignKey: 'IdRoles',
	as: 'Roles'
})

BusinessCompany.hasOne(CompanyPreference, {
	foreignKey: 'EntityId',
	as: "CompanyPref"
});

BusinessCompany.hasMany(PositionRate, {
	foreignKey: 'Id_Entity'
});

PositionRate.belongsTo(BusinessCompany, { foreignKey: 'Id_Entity' });

//commentar si da error al correr migracion
BusinessCompany.belongsTo(BusinessCompany, {
	foreignKey: 'Id_Parent',
	as: "CompanyParent"
});

Shift.hasMany(ShiftDetail, { onDelete: 'cascade' });
ShiftDetail.hasOne(ShiftDetailEmployees, { onDelete: 'cascade' });
ShiftDetail.belongsTo(Shift);

ShiftDetailEmployees.belongsTo(ShiftDetail);
ShiftDetailEmployees.belongsTo(Employees);

Shift.hasOne(ShiftWorkOrder, { onDelete: 'cascade' });

Shift.belongsTo(BusinessCompany, {
	foreignKey: 'entityId',
	as: 'ShiftEntity'
})

ShiftDetail.belongsTo(ShiftWorkOrder, {
	foreignKey: 'ShiftId',
	as: 'ShiftWorkOrder'
})

WorkOrder.hasMany(ShiftWorkOrder);

ShiftWorkOrder.belongsTo(WorkOrder, {
	foreignKey: 'WorkOrderId',
	as: 'WorkOrder'
});

ShiftWorkOrder.belongsTo(Shift, {
	foreignKey: 'ShiftId',
	as: 'Shift'
});

Employees.hasMany(ShiftDetailEmployees);

ShiftDetailEmployees.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});

Employees.belongsTo(Users, {
	foreignKey: 'idUsers'
});

Users.hasOne(Employees, {
	foreignKey: 'idUsers'
});

Employees.hasMany(MarkedEmployees)

Employees.belongsTo(CatalogItem, {
	foreignKey: 'Id_Deparment',
	as: 'CatalogDepartment'
});

CatalogItem.hasMany(Employees, {
	foreignKey: 'Id_Deparment'
});

Employees.belongsTo(PositionRate, {
	foreignKey: 'Contact_Title',
	as: 'Title'
});

MarkedEmployees.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});

// MarkedEmployees.belongsTo(CatalogItem, {
// 	foreignKey: 'typeMarkedId',
// 	as: 'CatalogMarked'
// });

MarkedEmployees.belongsTo(Shift);
MarkedEmployees.belongsTo(BusinessCompany, {
	foreignKey: 'entityId',
});


Application.hasOne(ApplicationEmployees);
Employees.hasOne(ApplicationEmployees);

ApplicationEmployees.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});

ApplicationEmployees.belongsTo(Application, {
	foreignKey: 'ApplicationId',
	as: 'Application'
});

TemplateShift.belongsTo(Template);
TemplateShift.belongsTo(Shift);
CatalogItem.hasMany(Contacts, {
	foreignKey: 'Id_Deparment',
	as: 'Contacts'
})

//commentar si da error al correr migracion
CatalogItem.hasMany(BusinessCompany, {
	foreignKey: 'Region'
});

//commentar si da error al correr migracion
BusinessCompany.belongsTo(CatalogItem, {
	foreignKey: 'Region',
	as: 'Regions'
})

CatalogItem.hasMany(WorkOrder, {
	foreignKey: 'departmentId'
});


// Opening recruiter associations
OpeningRecruiter.belongsTo(Users, { foreignKey: 'recruiterId' });
OpeningRecruiter.belongsTo(Shift, { foreignKey: 'openingId' });

Users.hasMany(OpeningRecruiter, {
	foreignKey: 'recruiterId'
});

Shift.hasMany(OpeningRecruiter, {
	foreignKey: 'openingId'
});

SmsLog.belongsTo(Employees);
SmsLog.belongsTo(Shift);
//commentar si da error al correr migracion
Contacts.belongsTo(BusinessCompany, { foreignKey: 'Id_Entity' });
//commentar si da error al correr migracion
Contacts.belongsTo(Application, { foreignKey: 'ApplicationId' });
BusinessCompany.hasMany(Contacts, { foreignKey: 'Id_Entity' });
//commentar si da error al correr migracion
BusinessCompany.hasMany(CatalogItem, { foreignKey: 'Id_Entity' });

BusinessCompany.hasMany(WorkOrder, { foreignKey: 'IdEntity' });

BreakRuleModel.belongsTo(BusinessCompany, {
	foreignKey: 'businessCompanyId',
	as: 'BusinessCompany'
})

BreakRuleModel.hasOne(BreakRuleDetailModel, {
	foreignKey: 'breakRuleId'
})

BreakRuleDetailModel.belongsTo(BreakRuleModel, {
	foreignKey: 'breakRuleId',
	as: 'BreakRule'
});

Employees.hasMany(Employee_BreakRule, {
	foreignKey: 'employeeId'
});

BreakRuleModel.hasMany(Employee_BreakRule, {
	foreignKey: 'breakRuleId'
});

Employee_BreakRule.belongsTo(Employees, {
	foreignKey: 'employeeId'
});

Employee_BreakRule.belongsTo(BreakRuleModel, {
	foreignKey: 'breakRuleId'
});

Visit.belongsTo(Users, {
	foreignKey: 'OpManagerId'
});

Visit.belongsTo(BusinessCompany, {
	foreignKey: 'BusinessCompanyId'
});

BusinessCompany.hasMany(EmployeeByHotel);

EmployeeByHotel.belongsTo(BusinessCompany, {
	foreignKey: 'BusinessCompanyId',
	as: 'BusinessCompanies'
});

Employees.hasMany(EmployeeByHotel);

EmployeeByHotel.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});

CatalogItem.hasMany(RegionsUsers, { foreignKey: 'RegionId' });
RegionsUsers.belongsTo(CatalogItem, { foreignKey: 'RegionId' });

Users.hasMany(RegionsUsers, { foreignKey: 'UserId' });
RegionsUsers.belongsTo(Users, { foreignKey: 'UserId' });

ConfigRegions.belongsTo(Users, {
	foreignKey: 'regionalManagerId',
	as: 'OperationManager'
});

ConfigRegions.belongsTo(CatalogItem, {
	foreignKey: 'regionId',
	as: 'Region'
});
CatalogItem.hasOne(ConfigRegions, {
	as: 'ConfigRegion',
	foreignKey: 'regionId'
});

Forms.belongsTo(Forms, {
	foreignKey: 'ParentId',
	as: 'ParentForm'
});

Feature.belongsTo(Roles);

Contracts.belongsTo(BusinessCompany, { foreignKey: 'Id_Entity' });
Contracts.belongsTo(BusinessCompany, { foreignKey: 'IdManagement' });
BusinessCompany.hasMany(Contracts, { foreignKey: 'Id_Entity' });
BusinessCompany.hasMany(Contracts, { foreignKey: 'IdManagement' });
Contracts.belongsTo(Users, { foreignKey: 'Id_User_Signed' });
Contracts.belongsTo(Users, { foreignKey: 'Id_User_Billing_Contact' });
Users.hasMany(Contracts, { foreignKey: 'Id_User_Signed' });
Users.hasMany(Contracts, { foreignKey: 'Id_User_Billing_Contact' });

Contracts.hasMany(Tokens, { foreignKey: 'Id_Contract' });
Tokens.belongsTo(Contracts, { foreignKey: 'Id_Contract' });


Conn.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

// Conn.sync({ force: false }).then(() => {
/*make sure you use false here. otherwise the total data
	from the impported models will get deleted and new tables will be created*/
// now we cann do all db operations on customers table.
//Ex:- lets read all data
//	console.log('Applications Inside Connection', Applications.findAll);
//	Applications.findAll().then((applications) => {
//console.log('Applications are:-', applications);
//	});
//	console.log('sync is completed');
// });

export default Conn;
