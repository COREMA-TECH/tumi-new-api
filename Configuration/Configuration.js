import Sequelize from 'sequelize';

const user = 'corema';
const database = 'Tumi_Dev';
const password = 'S0l040.246.';
const host = 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com';
//const host = 'http://localhost:4000/graphql';
const port = 5432;

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

export { ConfigPg, Conn };
