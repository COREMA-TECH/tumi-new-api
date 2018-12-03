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

import CatalogItemModel from './catalogItemTable';
import UsersModel from './UsersTable';

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

const Zipcode = ZipcodeModel.createModel(Conn);
Zipcode.removeAttribute('id');

const ApplicationPhases = ApplicationPhasesModel.createModel(Conn);
ApplicationPhases.belongsTo(CatalogItem, {
	foreignKey: 'ReasonId',
	as: 'Reason'
});
ApplicationPhases.belongsTo(Application);

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

ApplicantDisclosure.belongsTo(Application);
ApplicantConductCode.belongsTo(Application);
ApplicantBackgroundCheck.belongsTo(Application);
ApplicantHarassmentPolicy.belongsTo(Application);
ApplicantWorkerCompensation.belongsTo(Application);

WorkOrder.belongsTo(PositionRate);
// WorkOrder.belongsTo(CatalogItem, {
// 	foreignKey: 'status'
// });
WorkOrder.hasMany(WorkOrderPosition, { onDelete: 'cascade' });
WorkOrderPosition.belongsTo(PositionRate);
// WorkOrderPosition.belongsTo(CatalogItem, {
// 	foreignKey: 'status'
// });
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

Application.belongsTo(CatalogItem, {
	foreignKey: 'positionApplyingFor',
	as: 'CatalogPosition'
});
Application.belongsTo(CatalogItem, {
	foreignKey: 'state',
	as: 'CatalogState'
});

Application.belongsTo(CatalogItem, {
	foreignKey: 'city',
	as: 'CatalogCity'
});

Conn.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

Conn.sync({ force: false }).then(() => {
	/*make sure you use false here. otherwise the total data 
		from the impported models will get deleted and new tables will be created*/
	// now we cann do all db operations on customers table.
	//Ex:- lets read all data
	//	console.log('Applications Inside Connection', Applications.findAll);
	//	Applications.findAll().then((applications) => {
	//console.log('Applications are:-', applications);
	//	});
	//	console.log('sync is completed');
});

export default Conn;
