  
//const ConfigPg = "postgres://corema:S0l040.246.@coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com:5432/Tumi_Dev";

const ConfigPg = {
  user: 'corema', // env var: PGUSER
  database: 'Tumi', // env var: PGDATABASE
  password: 'S0l040.246.', // env var: PGPASSWORD
  //host: 'coremagroup.cb4kqp6rssxe.us-east-2.rds.amazonaws.com', // Server hosting the postgres database
  host: 'localhost', // Server hosting the postgres database
  port: 5432, // env var: PGPORT
  max: 10, // max number of clients in the pool
  idleTimeoutMillis: 900000 // how long a client is allowed to remain idle before being closed
}

module.exports = ConfigPg;
