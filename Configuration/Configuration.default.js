import Sequelize from 'sequelize';

const environments = {
	dev: { 
		user: 'corema',
		password: 'S0l040.246.',
		host: 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com',
		port: '5000', 
		database: 'Tumi_Dev', 
		databasePort: 5432, 
		webPORT: 3001, 
		webURL: 'http://ec2-3-16-143-115.us-east-2.compute.amazonaws.com' 
	},
	prod: { 
		user: 'tumiusr',
		password: 'Nicaragu^&jkiu#z',
		host: 'tumidb.cnzodd8fyfab.us-east-1.rds.amazonaws.com',
		port: '4000', 
		database: 'tumidb', 
		databasePort: 5432, 
		webPORT: 3000, 
		webURL: 'http://app.orionsystem1.com' 
	},
	cert: { 
		user: 'corema',
		password: 'S0l040.246.',
		host: 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com',
		port: '4001', 
		database: 'Tumi_Certi', 
		databasePort: 5432, 
		webPORT: 3002, 
		webURL: 'http://ec2-3-16-143-115.us-east-2.compute.amazonaws.com' 
	}
}

/*****MODIFICAR ACA */
const STR_ENV = 'dev';
/*********************/

const { user, password, host, port, database, webPORT, webURL, databasePort } = environments[STR_ENV];
const URLWeb = `${webURL}:${webPORT}`;
const URLAccept = `${webURL}/home/schedules-accept`;
const MY_PORT = port;

const nodemailer = require('nodemailer');
let mailParams = {
	host: 'a2plcpnl0839.prod.iad2.secureserver.net',
	port: 465,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: 'olonyl.rocha@coremagroup.com',
		pass: 'J0$e87**'
	}
};

const Transporter = nodemailer.createTransport(mailParams);

const ConfigPg = {
	user: user, // env var: PGUSER
	database: database, // env var: PGDATABASE
	password: password, // env var: PGPASSWORD
	host: host, // Server hosting the postgres database
	port: databasePort, // env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 900000 // how long a client is allowed to remain idle before being closed
};

const Conn = new Sequelize(database, user, password, {
	dialect: 'postgres',
	host: host,
	port: databasePort,
	schema: 'public',
	freezeTableName: true
});

export { URLWeb, URLAccept, ConfigPg, Conn, Transporter, MY_PORT };
