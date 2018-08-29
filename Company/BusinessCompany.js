const pg = require('pg');
const express = require('express');
const Config = require('../Configuration/Configuration.js');

var Strquery,iparam; 

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

	Strquery = 'select * from public."BusinessCompany"  where "IsActive" = coalesce('+ strparam1 +',"IsActive") and "Id" = coalesce('+ strparam2 +',"Id") order by "Name"';

	console.log("query de companies ", Strquery);

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
    			Strquery = 'INSERT INTO public."BusinessCompany" ("Code", "Code01","Id_Company","BusinessType","Name","Description","Start_Week","End_Week","Start_Date","Legal_Name","Country","State","City","Id_Parent","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","ImageURL","Location","Location01","Rate","Zipcode", "Fax", "Phone_Prefix", "Phone_Number", "Primary_Email") VALUES('+ args.input.Code +','+ args.input.Code01 +',' +args.input.Id_Company +','+args.input.BusinessType+','+args.input.Name +','+args.input.Description +','+args.input.Start_Week+','+args.input.End_Week+','+args.input.Start_Date+','+args.input.Legal_Name+','+args.input.Country+','+args.input.State+','+args.input.City+','+args.input.Id_Parent+','+args.input.IsActive+','+args.input.User_Created+','+args.input.User_Updated+','+args.input.Date_Created+','+args.input.Date_Updated+','+args.input.ImageURL+','+args.input.Location+','+args.input.Location01+','+args.input.Rate+','+args.input.Zipcode+','+args.input.Fax+','+args.input.Phone_Prefix+','+args.input.Phone_Number+','+args.input.Primary_Email+')'
    		console.log(Strquery);	
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
    			Strquery = 'UPDATE public."BusinessCompany" SET "Code"='+ args.input.Code +',"Code01"='+ args.input.Code01 +',"Id_Company"='+args.input.Id_Company +', "BusinessType"='+args.input.BusinessType +', "Name"='+args.input.Name +', "Description"='+ args.input.Description +', "Start_Week"='+ args.input.Start_Week +', "End_Week"='+ args.input.End_Week +', "Start_Date"='+ args.input.Start_Date +', "Legal_Name"='+ args.input.Legal_Name +', "Country"='+ args.input.Country +', "State"='+ args.input.Country +', "City"='+args.input.City+', "Id_Parent"='+args.input.Id_Parent+', "IsActive"='+args.input.IsActive+', "User_Created"='+args.input.User_Created+', "User_Updated"='+args.input.User_Updated+', "Date_Created"='+args.input.Date_Created+', "Date_Updated"='+args.input.Date_Updated+', "ImageURL"='+ args.input.ImageURL +', "Location"='+ args.input.Location +', "Location01"='+ args.input.Location01 +', "Rate"='+ args.input.Rate +', "Zipcode"='+ args.input.Zipcode +', "Fax"='+ args.input.Fax +', "Phone_Prefix"='+ args.input.Phone_Prefix +', "Phone_Number"='+ args.input.Phone_Number +', "Primary_Email"='+ args.input.Primary_Email +' where "Id"=' + args.input.Id 
    	    console.log(Strquery);

    		}
    	    else{console.log("Error Update Data");}


    	    console.log(Strquery);

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


module.exports = getCompanies;
module.exports = InsCompanies;
module.exports = UpdCompanies;
module.exports = DelCompanies;