import Sequelize from 'sequelize';

const user = 'corema';

const environments = {
	dev: { database: 'Tumi_Dev', port: 3001, url: 'http://ec2-3-16-143-115.us-east-2.compute.amazonaws.com' },
	prod: { database: 'TUMI', port: 3000, url: 'http://ec2-52-14-244-20.us-east-2.compute.amazonaws.com' },
	qua: { database: 'Tumi_Certi', port: 3002, url: 'http://ec2-3-16-143-115.us-east-2.compute.amazonaws.com' }
}

const STR_ENV = 'dev';
const OBJ_ENV = environments[STR_ENV];
const database = OBJ_ENV.database;
const URLWeb = `${OBJ_ENV.database}:${OBJ_ENV.port}`;
const URLAccept = `${URLWeb}/home/schedules-accept`;

const password = 'S0l040.246.';
const host = 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com';
const port = 5432;

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
	port: port, // env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 900000 // how long a client is allowed to remain idle before being closed
};


const Conn = new Sequelize(database, user, password, {
	dialect: 'postgres',
	host: host,
	port: port,
	schema: 'public',
	freezeTableName: true
});

export { URLWeb, URLAccept, ConfigPg, Conn, Transporter };
