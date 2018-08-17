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

input iParamC {
Id : Int
Id_Entity: Int
Full_Name: String
Electronic_Address: String
Phone_Number: String
Contact_Type: Int
IsActive: Int
User_Created: Int
User_Updated: Int
Date_Created: String
Date_Updated: String
}

type iParamCI{
	Id: Int
	Id_Catalog: Int
	Id_Parent: Int
	Name: String
	DisplayLabel: String
	Description: String
	Value: String
	Value01: String
	Value02: String
	Value03: String
	Value04: String
	IsActive: Int,
    User_Created: Int,
    User_Updated: Int,
    Date_Created: String
    Date_Updated : String
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
	Start_Date: String
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
	getcompanies(Id:Int,IsActive:Int): [BusinessCompany]

	getelectronicaddress(Id:Int,IsActive:Int, Related_Table: String, Id_Entity :Int): [ElectronicAddress]
	getphonenumbers(Id:Int,IsActive:Int,Related_Table:String,Id_Entity :Int): [PhoneNumbers]
	getaddress(Id:Int,IsActive:Int,Related_Table: String, Id_Entity :Int): [Address]
	getcontacts(Id:Int,IsActive:Int, Id_Entity :Int): [Contacts]

	getcatalog(Id:Int,IsActive:Int): [Catalog]
	getcatalogitem(Id:Int,IsActive:Int,Id_Catalog:Int,Id_Parent:Int): [CatalogItem]
}

type Mutation{
	inscompanies(input: iParamBC): BusinessCompany 
	updcompanies(input: iParamBC): BusinessCompany
	delcompanies(Id:Int,IsActive:Int): BusinessCompany


	inselectronicaddress(input: iParamEA): ElectronicAddress
	updelectronicaddress(input: iParamEA): ElectronicAddress

	insphonenumbers(input: iParamPN): PhoneNumbers
	updphonenumbers(input: iParamPN): PhoneNumbers

	insaddress(input: iParamA): Address
	updaddress(input: iParamA): Address

	inscontacts(input: iParamC): Contacts
	updcontacts(input: iParamC): Contacts

	
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
		Start_Date: String
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

type Catalog{
	Id: Int
    Name: String
    Description: String
    IsActive: Int
    User_Created: Int
    User_Updated: Int
    Date_Created: String
    Date_Updated : String
}
type CatalogItem{
	Id: Int
	Id_Catalog: Int
	Id_Parent: Int
	Name: String
	DisplayLabel: String
	Description: String
	Value: String
	Value01: String
	Value02: String
	Value03: String
	Value04: String
	IsActive: Int,
    User_Created: Int,
    User_Updated: Int,
    Date_Created: String
    Date_Updated : String
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

type Contacts{
		Id : Int
		Id_Entity: Int
		Full_Name: String
		Electronic_Address: String
		Phone_Number: String
		Contact_Type: Int
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

var Strquery,iparam; ;
app.use(cors());

class BusinessCompany {
  constructor(Id,Code, Code01,Id_Company,BusinessType,Name,Description,Start_Week,End_Week,Start_Date,Legal_Name,Country,State,Region,City,Id_Parent,IsActive,User_Created,User_Updated,Date_Created,Date_Updated,ImageURL,Address) {
	this.Id= Id;
	this.Code= Code;
	this.Code01= Code01;
	this.Id_Company= Id_Company;
	this.BusinessType= BusinessType;
	this.Name= Name;
	this.Description= Description;
	this.Start_Week= Start_Week;
	this.End_Week= End_Week;
	this.Start_Date= Start_Date;
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
	this.Address = Address;
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

class Contacts {
  constructor(Id,Id_Entity, Full_Name,Electronic_Address,Phone_Number,Contact_Type,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Id_Entity= Id_Entity;
	this.Full_Name = Full_Name;
	this.Electronic_Address = Electronic_Address;
	this.Phone_Number = Phone_Number;
	this.Contact_Type = Contact_Type;
	this.IsActive = IsActive;
	this.User_Created = User_Created;
	this.User_Updated = User_Updated;
	this.Date_Created = Date_Created;
	this.Date_Updated = Date_Updated;
  }}

  class Catalog {
  constructor(Id, Name, Description, IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Name= Name;
	this.Description = Description;
	this.IsActive = IsActive;
	this.User_Created = User_Created;
	this.User_Updated = User_Updated;
	this.Date_Created = Date_Created;
	this.Date_Updated = Date_Updated;
  }
}

  class CatalogItem {
  constructor(Id, Id_Catalog, Id_Parent, Name, DisplayLabel, Description, Value, Value01, Value02, Value03, Value04,IsActive,User_Created,User_Updated,Date_Created,Date_Updated) {
	this.Id = Id;
	this.Id_Catalog= Id_Catalog;
	this.Id_Parent = Id_Parent;
	this.Name = Name;
	this.DisplayLabel = DisplayLabel;
	this.Description = Description;
	this.Value = Value;
	this.Value01 = Value01;
	this.Value02 = Value02;
	this.Value03 = Value03;
	this.Value04 = Value04;
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
	
	console.log(args.IsActive);
	var strparam1,strparam2,strparam3
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

	Strquery = 'select * from VWBusinessCompany where "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Id" = coalesce('+ strparam2 +',"Id")';

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
    			Strquery = 'INSERT INTO public."BusinessCompany" ("Code", "Code01","Id_Company","BusinessType","Name","Description","Start_Week","End_Week","Start_Date","Legal_Name","Country","State","Region","City","Id_Parent","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","ImageURL") VALUES('+ args.input.Code +','+ args.input.Code01 +',' +args.input.Id_Company +','+args.input.BusinessType+','+args.input.Name +','+args.input.Description +','+args.input.Start_Week+','+args.input.End_Week+','+args.input.Start_Date+','+args.input.Legal_Name+','+args.input.Country+','+args.input.State+','+args.input.Region+','+args.input.City+','+args.input.Id_Parent+','+args.input.IsActive+','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+','+args.input.ImageURL+')'
    		}
    	    else{console.log("Error Insert Data");}

console.log(Strquery);
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


async function DelCompanies (args) {
  try {
  	console.log("hola desde el del");
	  	console.log("aqui variable ",args.Id);
	  	console.log("aqui variable2 ",args.IsActive);
	  	
	  	if (args)
    		{
    			Strquery = 'UPDATE public."BusinessCompany" SET "IsActive"='+args.IsActive+' where "Id"=' + args.Id 
    		console.log(Strquery);
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

 	var strparam1,strparam2,strparam3,strparam4
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		if (args.Related_Table>=0) {strparam3= args.Related_Table  ;}
		else{strparam3 = null;}

		if(args.Id_Entity>=0){strparam4= args.Id_Entity;}
		else{strparam4 = null;}

	Strquery = 'select * from public."ElectronicAddress"  Where and "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Related_Table" = coalesce('+ strparam3 +',"Related_Table") and Id_Entity coalesce('+ strparam4 +',"Id_Entity")  and "Id" = coalesce('+ strparam2 +',"Id")';

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

  	var strparam1,strparam2,strparam3,strparam4
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		if (args.Related_Table>=0) {strparam3= args.Related_Table  ;}
		else{strparam3 = null;}

		if(args.Id_Entity>=0){strparam4= args.Id_Entity;}
		else{strparam4 = null;}

  
    	Strquery = 'select * from public."PhoneNumbers" Where and "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Related_Table" = coalesce('+ strparam3 +',"Related_Table") and "Id_Entity" = coalesce('+ strparam4 +',"Id_Entity")  and "Id" = coalesce('+ strparam2 +',"Id")'
  
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
  	var strparam1,strparam2,strparam3,strparam4
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		if (args.Related_Table>=0) {strparam3= args.Related_Table  ;}
		else{strparam3 = null;}

		if(args.Id_Entity>=0){strparam4= args.Id_Entity;}
		else{strparam4 = null;}
  	
    	    Strquery = 'select * from public."Address" Where and "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Related_Table" = coalesce('+ strparam3 +',"Related_Table") and Id_Entity = coalesce('+ strparam4 +',"Id_Entity")  and "Id" = coalesce('+ strparam2 +',"Id")'
    		
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

//Method Connect to table ContactsCompany
async function getContacts (args) {
  try {

  		var strparam1,strparam2,strparam3
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		if (args.Id_Entity>=0) {strparam3= args.Id_Entity  ;}
		else{strparam3 = null;}

		     Strquery = 'select * from public."Contacts" Where  "IsActive" = coalesce('+ strparam1 +',"IsActive") and  "Id_Entity" = coalesce('+ strparam3 +',"Id_Entity")  and "Id" = coalesce('+ strparam2 +',"Id")'
    		console.log(Strquery);

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function InsContacts (args) {
  try {
  	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."Contacts" ("Id_Entity", "Full_Name", "Electronic_Address", "Phone_Number", "Contact_Type" , "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES('+ args.input.Id_Entity +','+ args.input.Full_Name +',' +args.input.Electronic_Address +','+args.input.Phone_Number+','+args.input.Contact_Type +','+args.input.IsActive +','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdContacts (args) {
  try {
	  	if (args)
    		{
    			Strquery = 'UPDATE public."Contacts" SET "Id_Entity"='+ args.input.Id_Entity +',"Full_Name"='+ args.input.Full_Name +',"Electronic_Address"='+args.input.Electronic_Address +', "Phone_Number"='+args.input.Phone_Number +', "Contact_Type"='+args.input.Contact_Type +', "IsActive"='+ args.input.IsActive +', "User_Created"='+ args.input.User_Created +', "User_Updated"='+ args.input.User_Updated +', "Date_Created"='+ args.input.Date_Created +', "Date_Updated"='+ args.input.Date_Updated +' where "Id"=' + args.input.Id 
    		}
    	    else{console.log("Error Update Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}


//Method Connect to table Catalog
async function getCatalog (args) {
  try {
console.log('entro aqui');

  		var strparam1,strparam2,strparam3
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		     Strquery = 'select * from public."Catalog" Where  "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Id" = coalesce('+ strparam2 +',"Id")'
    		console.log(Strquery);

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

//Method Connect to table CatalogItem
async function getCatalogItem (args) {
  try {

  		var strparam1,strparam2,strparam3
	
		if (args.IsActive>=0) {strparam1= args.IsActive  ;}
		else{strparam1 = null;}

		if (args.Id>=0) {strparam2= args.Id  ;}
		else{strparam2 = null;}

		if (args.Id_Catalog>=0) {strparam3= args.Id_Catalog  ;}
		else{strparam3 = null;}

		if (args.Id_Parent>=0) {strparam4= args.Id_Parent  ;}
		else{strparam4 = 0;}

		     Strquery = 'select * from public."CatalogItem" Where  "IsActive" = coalesce('+ strparam1 +',"IsActive") and  "Id_Catalog" = coalesce('+ strparam3 +',"Id_Catalog")  and "Id" = coalesce('+ strparam2 +',"Id") and "Id_Parent" = coalesce('+ strparam4 +',"Id_Parent")'
    		console.log(Strquery);

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function InsCatalogItem (args) {
  try {
  	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."CatalogItem" ( "Id_Catalog", "Id_Parent", "Name", "DisplayLabel", "Description", "Value", "Value01", "Value02", "Value03", "Value04", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated")) VALUES('+ args.input.Id_Catalog +','+ args.input.Id_Parent +',' +args.input.Name +','+args.input.DisplayLabel+','+args.input.Description +','+args.input.Value +','+args.input.Value01+','+args.input.Value02+','+args.input.Value03+','+args.input.Value04 +','+args.input.IsActive +','+args.input.User_Created +','+args.input.User_Updated +','+args.input.Date_Created +','+ args.input.Date_Updated +')'
    		}
    	    else{console.log("Error Insert Data");}

    const { rows } = await query(Strquery)
    return rows;
  } catch (err) {
    console.log('Database ' + err)
  }
}

async function UpdCatalogItem (args) {
  try {
  	  	if (args)
    		{
    			Strquery = 'INSERT INTO public."CatalogItem" ( "Id_Catalog", "Id_Parent", "Name", "DisplayLabel", "Description", "Value", "Value01", "Value02", "Value03", "Value04", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated")) VALUES('+ args.input.Id_Catalog +','+ args.input.Id_Parent +',' +args.input.Name +','+args.input.DisplayLabel+','+args.input.Description +','+args.input.Value +','+args.input.Value01+','+args.input.Value02+','+args.input.Value03+','+args.input.Value04 +','+args.input.IsActive +','+args.input.User_Created +','+args.input.User_Updated +','+args.input.Date_Created +','+ args.input.Date_Updated +')'
    		}
    	    else{console.log("Error Insert Data");}

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
delcompanies: DelCompanies,


getelectronicaddress: getElectronicAddress,
inselectronicaddress: InsElectronicAddress,
updelectronicaddress: UpdElectronicAddress,

getphonenumbers: getPhoneNumbers,
insphonenumbers: InsPhoneNumbers,
updphonenumbers: UpdPhoneNumbers,

getaddress: getAddress,
insaddress: InsAddress,
updaddress: UpdAddress,

getcontacts: getContacts,
inscontacts: InsContacts,
updcontacts: UpdContacts,

getcatalog: getCatalog,
getcatalogitem: getCatalogItem,

//inscatalogitem:InsCatalogItem,
//updcatalogitem: UpdCatalogItem,
}

app.use('/graphql',express_graphql({
	schema: schema,
	rootValue: root,
    graphiql:true,
}));

app.listen((process.env.PORT || 3000), function () {
    console.log('Server is running.. on Port 3000');	
});

