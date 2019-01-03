import Sequelize from 'sequelize';

const user = 'corema';
const database = 'Tumi_Cert';
//const database = 'Tumi_Dev';
const password = 'S0l040.246.';
const host = 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com';
//const host = 'localhost';
const URLWeb = 'http://ec2-52-14-244-20.us-east-2.compute.amazonaws.com:3000';
//const URLWeb = 'https://corema-dev-env.herokuapp.com';
const port = 5432;
const URLAccept = 'http://ec2-3-16-143-115.us-east-2.compute.amazonaws.com:3001/home/schedules-accept/';
//const URLReject = 'https://corema-dev-env.herokuapp.com';


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

export { URLWeb, URLAccept, ConfigPg, Conn };
