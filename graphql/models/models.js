import Sequelize from 'sequelize';
import ApplicationModel from './applicationTable';
import ElectronicAddressModel from './electronicaddressTable';
import ApplicantLanaguageModel from './applicantLanguage';

const Conn = new Sequelize('Tumi_Dev', 'postgres', 'S0l040.246.', {
	dialect: 'postgres',
	host: 'localhost',
	port: '5432',
	schema: 'public',
	freezeTableName: true
});

const ElectronicAddress = ElectronicAddressModel.createModel(Conn);
const Application = ApplicationModel.createModel(Conn);
const ApplicantLanguage = ApplicantLanaguageModel.createModel(Conn);

Application.hasMany(ApplicantLanguage);
ApplicantLanguage.belongsTo(Application);

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
