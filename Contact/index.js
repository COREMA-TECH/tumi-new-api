const pg = require('pg');
const express = require('express');
const app =  express();
var cors = require('cors');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const Config = require('../Configuration/Configuration.js');

const schema = buildSchema(`

input iParam {
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

type Query
{
	getcompanies(Id:Int): [BusinessCompany]
}

type Mutation{
	inscompanies(input: iParam): BusinessCompany
	updcompanies(input: iParam): BusinessCompany
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

class BusinessCompany {
  constructor(Id,Code, Code01,Id_Company,BusinessType,Name,Description,Start_Week,End_Week,Start_Day,Legal_Name,Country,State,Region,City,Id_Parent,IsActive,User_Created,User_Updated,Date_Created,Date_Updated,ImageURL) {
	this.Id= Id;
	this.Code= Code;
	this.Code01= Code01;
	this.Id_Company= Id_Company;
	this.BusinessType= BusinessType;
	this.Name= Name;
	this.Description= Description;
	this.Start_Week= Start_Week;
	this.End_Week= End_Week;
	this.Start_Day= Start_Day;
	this.Legal_Name= Country;
	this.Country= Country;
	this.State= State;
	this.Region= Region;
	this.City= City;
	this.Id_Parent= Id_Parent;
	this.IsActive= IsActive;
	this.User_Created= User_Created;
	this.User_Updated= User_Updated;
	this.Date_Created= Date_Created;
	this.Date_Updated= Date_Updated;
	this.ImageURL= ImageURL;
  }
}

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

async function InsCompanies (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."BusinessCompany" ("Code", "Code01","Id_Company","BusinessType","Name","Description","Start_Week","End_Week","Start_Day","Legal_Name","Country","State","Region","City","Id_Parent","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","ImageURL") VALUES('+ args.input.Code +','+ args.input.Code01 +',' +args.input.Id_Company +','+args.input.BusinessType+','+args.input.Name +','+args.input.Description +','+args.input.Start_Week+','+args.input.End_Week+','+args.input.Start_Day+','+args.input.Legal_Name+','+args.input.Country+','+args.input.State+','+args.input.Region+','+args.input.City+','+args.input.Id_Parent+','+args.input.IsActive+','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+','+args.input.ImageURL+')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdCompanies (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'UPDATE public."BusinessCompany" SET "Code"='+ args.input.Code +',"Code01"='+ args.input.Code01 +',"Id_Company"='+args.input.Id_Company +', "BusinessType"='+args.input.BusinessType +', "Name"='+args.input.Name +', "Description"='+ args.input.Description +', "Start_Week"='+ args.input.Start_Week +', "End_Week"='+ args.input.End_Week +', "Start_Day"='+ args.input.Start_Day +', "Legal_Name"='+ args.input.Legal_Name +', "Country"='+ args.input.Country +', "State"='+ args.input.Country +', "Region"='+ args.input.Region +', "City"='+args.input.City+', "Id_Parent"='+args.input.Id_Parent+', "IsActive"='+args.input.IsActive+', "User_Created"='+args.input.User_Created+', "User_Updated"='+args.input.User_Updated+', "Date_Created"='+args.input.Date_Created+', "Date_Updated"='+args.input.Date_Updated+', "ImageURL"='+ args.input.ImageURL +' where "Id"=' + args.input.Id 
    		}
    	    else{console.log("Error Update Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

const root = {
getcompanies: getCompanies,
inscompanies: InsCompanies,
updcompanies: UpdCompanies,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen((process.env.PORT || 3000), function () {
    console.log('Server is running.. on Port 3000');	
});

