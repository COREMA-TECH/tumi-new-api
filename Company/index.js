const pg = require('pg');
const express = require('express');
const app =  express();
var cors = require('cors');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const Config = require('../Configuration/Configuration.js');

const schema = buildSchema(`
type Query
{
	companies(Id:Int): [BusinessCompany]
}


type BusinessCompany{
	Id: Int
	Code: String
	Code01: String
	Id_Company: Int
	BusinessType: Int
	Name: String
	Description: String
	Start_Week: Int
	End_Week: Int
	Start_Day: Int
	Legal_Name: String
	Country: Int
	State: Int
	Region: Int
	City: Int
	Id_Parent: Int
	IsActive: Int
	User_Created: Int
	User_Updated: Int
	Date_Created: String
	Date_Updated: String
	ImageURL: String
}
`);

var Strquery,GraphResult ;
app.use(cors());

//Conection to BD
const pool = new pg.Pool(Config);
async function query (q) {
  const client = await pool.connect();

  let res
  try {
    await client.query('BEGIN')
    try {
      res = await client.query(q)
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  } finally {
    client.release()
  }
  return res
}

//Method Connect to table BusinessCompany
async function getCompanies (args) {
  try {
	
	  	if (args.Id)
    		{
    			Strquery = 'select * from public."BusinessCompany" where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from public."BusinessCompany"';}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

const root = {
companies: getCompanies,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen((process.env.PORT || 3000), function () {
    console.log('Server is running.. on Port 3000');
});


/*app.listen(3000, function () {
    console.log('Server is running.. on Port 3000');
});*/
