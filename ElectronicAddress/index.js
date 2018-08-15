const pg = require('pg');
const express = require('express');
const app =  express();
var cors = require('cors');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const Config = require('../Configuration/Configuration.js');

const schema = buildSchema(`

input iParam {
Id : Int
Related_Table: String
Id_Entity : Int
Electronic_Address_Type: Int
Electronic_Address: String
IsPrimary: Int
IsActive: Int
User_Created: Int
User_Updated: Int
Date_Created: String
Date_Updated: String
}

type Query
{
	getelectronicaddress(Id:Int): [ElectronicAddress]
}

type Mutation{
	inselectronicaddress(input: iParam): ElectronicAddress
	updelectronicaddress(input: iParam): ElectronicAddress
}

type ElectronicAddress{
		Id : Int
		Related_Table: String
		Id_Entity : Int
		Electronic_Address_Type: Int
		Electronic_Address: String
		IsPrimary: Int
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated: String
}
`);

var Strquery,GraphResult ;
app.use(cors());

class ElectronicAddress {
  constructor(Id,Related_Table, Id_Entity,Electronic_Address_Type,Electronic_Address,IsPrimary,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Related_Table= Related_Table;
	this.Id_Entity = Id_Entity
	this.Electronic_Address_Type = Electronic_Address_Type
	this.Electronic_Address = Electronic_Address
	this.IsPrimary = IsPrimary
	this.IsActive = IsActive
	this.User_Created = User_Created
	this.User_Updated = User_Updated
	this.Date_Created = Date_Created
	this.Date_Updated = Date_Updated
  }
}

//Conection to BD
const pool = new pg.Pool(Config);
async function query (q) {
	console.log("querys ",q);
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
async function getElectronicAddress (args) {
  try {
	
	  	if (args.Id)
    		{
    			Strquery = 'select * from public."ElectronicAddress" where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from public."ElectronicAddress"';}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function InsElectronicAddress (args) {
  try {
  	console.log("entro aqui");
	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."ElectronicAddress" ("Related_Table", "Id_Entity", "Electronic_Address_Type", "Electronic_Address", "IsPrimary", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES('+ args.input.Related_Table +','+ args.input.Id_Entity +',' +args.input.Electronic_Address_Type +','+args.input.Electronic_Address+','+args.input.IsPrimary +','+args.input.IsActive +','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdElectronicAddress (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'UPDATE public."ElectronicAddress" SET "Related_Table"='+ args.input.Related_Table +',"Id_Entity"='+ args.input.Id_Entity +',"Electronic_Address_Type"='+args.input.Electronic_Address_Type +', "Electronic_Address"='+args.input.Electronic_Address +', "IsPrimary"='+args.input.IsPrimary +', "IsActive"='+ args.input.IsActive +', "User_Created"='+ args.input.User_Created +', "User_Updated"='+ args.input.User_Updated +', "Date_Created"='+ args.input.Date_Created +', "Date_Updated"='+ args.input.Date_Updated +' where "Id"=' + args.input.Id 
    		}
    	    else{console.log("Error Update Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

const root = {
getelectronicaddress: getElectronicAddress,
inselectronicaddress: InsElectronicAddress,
updelectronicaddress: UpdElectronicAddress,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen((process.env.PORT || 4000), function () {
    console.log('Server is running.. on Port 4000');	
});

