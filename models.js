import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';

const Conn = new Sequelize('Tumi_Dev', 'postgres', 'S0l040.246.', {
	dialect: 'postgres',
	host: 'localhost',
	port: '5432',
	schema: 'public'
});

Conn.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.');
	})
	.catch((err) => {
		console.error('Unable to connect to the database:', err);
	});

const Applications = Conn.define('Applications', {
	firstName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	middleName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	lastName: {
		type: Sequelize.STRING,
		allowNull: false
	},
	date: {
		type: Sequelize.DATE,
		allowNull: false
	},
	streetAddress: {
		type: Sequelize.STRING,
		allowNull: false
	},
	aptNumber: {
		type: Sequelize.STRING,
		allowNull: false
	},
	city: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	state: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	zipCode: {
		type: Sequelize.STRING,
		allowNull: false
	},
	homePhone: {
		type: Sequelize.STRING,
		allowNull: false
	},
	cellPhone: {
		type: Sequelize.STRING,
		allowNull: false
	},
	socialSecurityNumber: {
		type: Sequelize.STRING,
		allowNull: false
	},
	positionApplyingFor: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	dateAvailable: {
		type: Sequelize.DATE,
		allowNull: false
	},
	scheduleRestrictions: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	},
	scheduleExplain: {
		type: Sequelize.STRING,
		allowNull: false
	},
	convicted: {
		type: Sequelize.BOOLEAN,
		allowNull: false
	},
	convictedExplain: {
		type: Sequelize.STRING,
		allowNull: false
	},
	comment: {
		type: Sequelize.STRING,
		allowNull: false
	}
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
