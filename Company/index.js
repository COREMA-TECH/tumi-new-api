const pg = require('pg');
const express = require('express');
const app =  express();
var cors = require('cors');
const express_graphql = require('express-graphql');
const { buildSchema } = require('graphql');
const Config = require('../Configuration/Configuration.js');

const schema = buildSchema(`

input iParamEA {
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

input iParamA {
Id: Int
Related_Table: String
Id_Entity: Int
Address_Type: Int
Address: String
Country: Int
State: Int
Region: Int
City: Int
IsPrimary: Int
IsActive: Int
User_Created: Int
User_Updated: Int
Date_Created: String
Date_Updated: String
}

input iParamPN {
Id : Int
Related_Table: String
Id_Entity: Int
Phone_Type: String
Phone_Prefix: String
Phone_Number: String
IsActive: Int
User_Created: Int
User_Updated: Int
Date_Created: String
Date_Updated: String
}

input iParamBC {
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
	getelectronicaddress(Id:Int): [ElectronicAddress]
	getphonenumbers(Id:Int): [PhoneNumbers]
	getaddress(Id:Int): [Address]
}

type Mutation{
	inscompanies(input: iParamBC): BusinessCompany 
	updcompanies(input: iParamBC): BusinessCompany

	inselectronicaddress(input: iParamEA): ElectronicAddress
	updelectronicaddress(input: iParamEA): ElectronicAddress

	insphonenumbers(input: iParamPN): PhoneNumbers
	updphonenumbers(input: iParamPN): PhoneNumbers

	insaddress(input: iParamA): Address
	updaddress(input: iParamA): Address
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
		Address: String
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

type PhoneNumbers{
		Id : Int
		Related_Table: String
		Id_Entity: Int
		Phone_Type: String
		Phone_Prefix: String
		Phone_Number: String
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated: String
}

type Address{
		Id : Int
		Related_Table: String
		Id_Entity: Int
		Address_Type: Int
	    Address: String
	    Country: Int
	    State: Int
	    Region: Int
	    City: Int
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

class PhoneNumbers {
  constructor(Id,Related_Table, Id_Entity,Phone_Type,Phone_Prefix,Phone_Number,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Related_Table= Related_Table;
	this.Id_Entity = Id_Entity;
	this.Phone_Type = Phone_Type;
	this.Phone_Prefix = Phone_Prefix;
	this.Phone_Number = Phone_Number;
	this.IsActive = IsActive;
	this.User_Created = User_Created;
	this.User_Updated = User_Updated;
	this.Date_Created = Date_Created;
	this.Date_Updated = Date_Updated;
  }
}

class ElectronicAddress {
  constructor(Id,Related_Table, Id_Entity,Electronic_Address_Type,Electronic_Address,IsPrimary,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Related_Table= Related_Table;
	this.Id_Entity = Id_Entity;
	this.Electronic_Address_Type = Electronic_Address_Type;
	this.Electronic_Address = Electronic_Address;
	this.IsPrimary = IsPrimary;
	this.IsActive = IsActive;
	this.User_Created = User_Created;
	this.User_Updated = User_Updated;
	this.Date_Created = Date_Created;
	this.Date_Updated = Date_Updated;
  }
}


class Address {
  constructor(Id,Related_Table, Id_Entity,Address_Type,Address,Country,State,Region,City,IsPrimary,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Related_Table= Related_Table;
	this.Id_Entity = Id_Entity;
	this.Address_Type=Address_Type;
    this.Address=Address;
    this.Country = Country;
    this.State = State;
    this.Region= Region;
    this.City=City;
	this.IsPrimary = IsPrimary;
	this.IsActive = IsActive;
	this.User_Created = User_Created;
	this.User_Updated = User_Updated;
	this.Date_Created = Date_Created;
	this.Date_Updated = Date_Updated;
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
	var Strtable="'BusinessCompany'";

	  	if (args.Id)
    		{
    			Strquery = 'select * from VWBusinessCompany  where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from VWBusinessCompany ';}

	console.log(Strquery);

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

//Method Connect to table ElectronicAddress
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

//Method Connect to table PhoneNumbers
async function getPhoneNumbers (args) {
  try {
	
	  	if (args.Id)
    		{
    			Strquery = 'select * from public."PhoneNumbers" where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from public."PhoneNumbers"';}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function InsPhoneNumbers (args) {
  try {
  	console.log("entro aqui");
	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."PhoneNumbers" ("Related_Table", "Id_Entity", "Phone_Type", "Phone_Prefix", "Phone_Number", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES('+ args.input.Related_Table +','+ args.input.Id_Entity +',' +args.input.Phone_Type +','+args.input.Phone_Prefix+','+args.input.Phone_Number +','+args.input.IsActive +','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdPhoneNumbers (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'UPDATE public."PhoneNumbers" SET "Related_Table"='+ args.input.Related_Table +',"Id_Entity"='+ args.input.Id_Entity +',"Phone_Type"='+args.input.Phone_Type +', "Phone_Prefix"='+args.input.Phone_Prefix +', "Phone_Number"='+args.input.Phone_Number +', "IsActive"='+ args.input.IsActive +', "User_Created"='+ args.input.User_Created +', "User_Updated"='+ args.input.User_Updated +', "Date_Created"='+ args.input.Date_Created +', "Date_Updated"='+ args.input.Date_Updated +' where "Id"=' + args.input.Id 
    		}
    	    else{console.log("Error Update Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

//Method Connect to table Address
async function getAddress (args) {
  try {
	
	  	if (args.Id)
    		{
    			Strquery = 'select * from public."Address" where "Id" = '+ args.Id
    		}
    	    else{Strquery = 'select * from public."Address"';}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function InsAddress (args) {
  try {
  	console.log("entro aqui");
	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."Address" ("Related_Table", "Id_Entity", "Address_Type", "Address", "Country" , "State" , "Region" , "City", "IsPrimary", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES('+ args.input.Related_Table +','+ args.input.Id_Entity +',' +args.input.Address_Type +','+args.input.Address+','+args.input.Country +','+args.input.State +','+args.input.Region +','+args.input.City +','+args.input.IsPrimary +','+args.input.IsActive +','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdAddress (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'UPDATE public."Address" SET "Related_Table"='+ args.input.Related_Table +',"Id_Entity"='+ args.input.Id_Entity +',"Address_Type"='+args.input.Address_Type +', "Address"='+args.input.Address +', "Country"='+args.input.Country +', "State"='+args.input.State +', "Region"='+args.input.Region +', "City"='+args.input.City +', "IsPrimary"='+args.input.IsPrimary +', "IsActive"='+ args.input.IsActive +', "User_Created"='+ args.input.User_Created +', "User_Updated"='+ args.input.User_Updated +', "Date_Created"='+ args.input.Date_Created +', "Date_Updated"='+ args.input.Date_Updated +' where "Id"=' + args.input.Id 
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

getelectronicaddress: getElectronicAddress,
inselectronicaddress: InsElectronicAddress,
updelectronicaddress: UpdElectronicAddress,

getphonenumbers: getPhoneNumbers,
insphonenumbers: InsPhoneNumbers,
updphonenumbers: UpdPhoneNumbers,

getaddress: getAddress,
insaddress: InsAddress,
updaddress: UpdAddress,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen((process.env.PORT || 3000), function () {
    console.log('Server is running.. on Port 3000');	
});

