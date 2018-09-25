import Sequelize from 'sequelize';
import ApplicationModel from './applicationTable';
import ElectronicAddressModel from './electronicaddressTable';
import ApplicantLanaguageModel from './applicantLanguageTable';
import ApplicantEducationModel from './applicantEducationTable';
import ApplicantPreviousEmploymentModel from './applicantPreviousEmploymentTable';
import ApplicantMilitaryServicesModel from './applicantMilitaryServiceTable';
import ApplicantSkillTableModel from './applicantSkillTable';

/*const Conn = new Sequelize('Tumi_Dev', 'postgres', 'S0l040.246.', {
	dialect: 'postgres',
	host: 'localhost',
	port: '5432',
	schema: 'public',
	freezeTableName: true
});*/

const Conn = new Sequelize('Tumi_Dev', 'corema', 'S0l040.246.', {
	dialect: 'postgres',
	host: 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com',
	port: '5432',
	schema: 'public',
	freezeTableName: true
});

const ElectronicAddress = ElectronicAddressModel.createModel(Conn);
const Application = ApplicationModel.createModel(Conn);
const ApplicantLanguage = ApplicantLanaguageModel.createModel(Conn);
const ApplicantEducation = ApplicantEducationModel.createModel(Conn);
const ApplicantPreviousEmployment = ApplicantPreviousEmploymentModel.createModel(Conn);
const ApplicantMilitaryServices = ApplicantMilitaryServicesModel.createModel(Conn);
const ApplicantSkill = ApplicantSkillTableModel.createModel(Conn);

Application.hasMany(ApplicantLanguage);
Application.hasMany(ApplicantEducation);
Application.hasMany(ApplicantPreviousEmployment);
Application.hasMany(ApplicantMilitaryServices);
Application.hasMany(ApplicantSkill);

ApplicantLanguage.belongsTo(Application);
ApplicantEducation.belongsTo(Application);
ApplicantPreviousEmployment.belongsTo(Application);
ApplicantMilitaryServices.belongsTo(Application);
ApplicantSkill.belongsTo(Application);

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
