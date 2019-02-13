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
import ApplicationEmployeesModel from './applicationEmployeesTable';

import TemplateModel from './templateTable';
import TemplateShiftModel from './templateShiftTable';

import ConfigRegionsModel from './configRegionsTable';

import { Conn } from '../../Configuration/Configuration';

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
const WorkOrder = WorkOrderModel.createModel(Conn);
const WorkOrderPosition = WorkOrderPositionModel.createModel(Conn);

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

const Employees = EmployeesModel.createModel(Conn);
const Shift = ShiftModel.createModel(Conn);
const ShiftDetail = ShiftDetailModel.createModel(Conn);
const ShiftDetailEmployees = ShiftDetailEmployeesModel.createModel(Conn);
const ShiftWorkOrder = ShiftWorkOrderModel.createModel(Conn);

const MarkedEmployees = MarkedEmployeesModel.createModel(Conn);
const ApplicationEmployees = ApplicationEmployeesModel.createModel(Conn);
const ApplicationPhases = ApplicationPhasesModel.createModel(Conn);

const Template = TemplateModel.createModel(Conn);
const TemplateShift = TemplateShiftModel.createModel(Conn);

const ConfigRegions = ConfigRegionsModel.createModel(Conn);

ApplicationPhases.belongsTo(CatalogItem, {
	foreignKey: 'ReasonId',
	as: 'Reason'
});

ApplicationPhases.belongsTo(WorkOrder, {
	foreignKey: 'WorkOrderId',
	as: 'WorkOrder'
})

ApplicationPhases.belongsTo(Application);

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

ApplicantLanguage.belongsTo(Application);
ApplicantEducation.belongsTo(Application);
ApplicantPreviousEmployment.belongsTo(Application);
ApplicantMilitaryServices.belongsTo(Application);
ApplicantSkill.belongsTo(Application);
ApplicantIdealJob.belongsTo(Application);
ApplicantDocument.belongsTo(Application);
ApplicantDocument.belongsTo(CatalogItem);

ApplicantIdealJob.belongsTo(CatalogItem, {
	foreignKey: 'idPosition',
	as: 'CatalogPosition'
});

ApplicantDisclosure.belongsTo(Application);
ApplicantConductCode.belongsTo(Application);
ApplicantBackgroundCheck.belongsTo(Application);
ApplicantHarassmentPolicy.belongsTo(Application);
ApplicantWorkerCompensation.belongsTo(Application);

WorkOrder.belongsTo(PositionRate);

WorkOrder.hasMany(WorkOrderPosition, { onDelete: 'cascade' });
WorkOrderPosition.belongsTo(PositionRate);

WorkOrder.hasMany(phaseworkOrder);
phaseworkOrder.belongsTo(WorkOrder);

WorkOrder.belongsTo(BusinessCompany, {
	foreignKey: 'IdEntity',
	as: 'BusinessCompanyWO'
});

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

//Forms.hasMany(RolesForms);
//Roles.hasMany(RolesForms);

RolesForms.belongsTo(Forms, {
	foreignKey: 'IdForms',
	as: 'Forms'
})

RolesForms.belongsTo(Roles, {
	foreignKey: 'IdRoles',
	as: 'Roles'
})


/*Employees.hasOne(ApplicationEmployees);

ApplicationEmployees.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});
*/

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


Employees.hasMany(MarkedEmployees)

MarkedEmployees.belongsTo(Employees, {
	foreignKey: 'EmployeeId',
	as: 'Employees'
});

MarkedEmployees.belongsTo(CatalogItem, {
	foreignKey: 'typeMarkedId',
	as: 'CatalogMarked'
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

Conn.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

//Conn.sync({ force: false }).then(() => {
/*make sure you use false here. otherwise the total data 
	from the impported models will get deleted and new tables will be created*/
// now we cann do all db operations on customers table.
//Ex:- lets read all data
//	console.log('Applications Inside Connection', Applications.findAll);
//	Applications.findAll().then((applications) => {
//console.log('Applications are:-', applications);
//	});
//	console.log('sync is completed');
//});

export default Conn;
