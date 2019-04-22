const pg = require('pg');
import { URLWeb, URLReject, URLAccept, ConfigPg } from './Configuration';
import jwt from 'jsonwebtoken';
//Requerimos el paquete
const nodemailer = require('nodemailer');
const pdf = require('html-pdf');

//Variables para PDF
const pdfshift = require('pdfshift')('2974f9467a93407fae7e39d931d1d732');
const fs = require('fs');

var cron = require('node-cron');

var Strquery, Strquery_2, Strfilename;

cron.schedule('59 11 * * *', () => {
	console.log('running a task At 23:59.');
	SendExpiredContracts();
	ChangeStatustoExpired();
	ChangeStatustoCompleted();
});



let mailParams = {
	host: 'a2plcpnl0839.prod.iad2.secureserver.net',
	port: 465,
	secure: true, // upgrade later with STARTTLS
	auth: {
		user: 'olonyl.rocha@coremagroup.com',
		pass: 'J0$e87**'
	}
};

var transporter = nodemailer.createTransport(mailParams);

async function ReturntoLead() {
	try {

		const strday = `'day'`;
		const strcomment = `'No Show'`
		Strquery =
			'INSERT INTO public."ApplicationPhases"("UserId", "ReasonId", "Comment", "createdAt", "updatedAt", "ApplicationId", "StageId")' +
			'SELECT 10,30458,' + strcomment + ',now(),now(),id,2 FROM public."Applications" where "idStages"=4 and "isActive" = true and DATE_PART(' + strday + ',NOW()-"updatedAt")>=15';

		const { rows } = await query(Strquery);

		ChangeStatusNS();
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function ChangeStatusNS() {
	try {
		const strday = `'day'`;
		const strcomment = `'No Show'`
		Strquery =
			'UPDATE public."Applications" SET "isLead"=true,"idStages"=2, "updatedAt" = Now()  where "idStages"=4 and "isActive" = true and DATE_PART(' + strday + ',NOW()-"updatedAt")>=15';

		ChangeStatusNS
		const { rows } = await query(Strquery);


		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function ChangeStatustoExpired() {
	try {
		const strday = `'day'`;
		const status = `'2'`;
	
		Strquery =
			'update public."Contracts" set "Contract_Status" = 2 where "IsActive" = 1  and "Contract_Status" <> ' + status + '   and DATE_PART( ' + strday + ' ,"Contract_Expiration_Date"::timestamp - NOW()::timestamp)<=0;';

		const { rows } = await query(Strquery);

		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function ChangeStatustoCompleted() {
	try {

		const status = `'0'`;
	
		Strquery =
			'update public."Contracts" set "Contract_Status" = 1 where "IsActive" = 1  and "Contract_Status" = ' + status + 'and "Client_Signature" IS NOT NULL AND "Company_Signature" IS NOT NULL ;';

		const { rows } = await query(Strquery);

		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function SendExpiredContracts() {
	console.log("Expiration contract");

	try {
		const strday = `'day'`;
		Strquery =
			'select CT."Id", TRIM(CT."Contract_Name") AS Contract_Name,CT."Contract_Expiration_Date", ' +
			'(SELECT "Electronic_Address" FROM public."Contacts" where "Id"= CT."Id_User_Signed") as "Electronic_Address", ' +
			'(SELECT "Primary_Email" FROM public."Company" where "Id"= CT."Id_Company") as "Primary_Email" ' +
			'from public."Contracts"  CT where CT."IsActive" = 1' +
			'and DATE_PART(' +
			strday +
			',  CT."Contract_Expiration_Date"::timestamp - NOW()::timestamp)<=30';

		console.log(Strquery);

		let htmlForEmail = (contractName, expirationDate) => (
            						`<div style="width: 100%; background: #fff; max-width: 800px; border: 2px solid #eee; border-radius: 3px; overflow: hidden; margin-right: 10px;">
										  <img src="https://i.imgur.com/Xshz5k1.png" alt="Tumi Staffing" style="display: block; width: 100%; max-width: 350px; margin: 0 auto; height: 180px; background: #ddd;">
										  <h2 style="width: 100%; text-align: center; color: #fed326; font-weight: 400; font-family: Helvetica">Contract Expiration Alert</h2>
										  <div style="text-align: center; font-family: Helvetica; font-weight: 400; color: #444">
												<p>For more information visit our contract page by clicking <a href="#">here</a></a></p>
										  </div>
										  <div style="background: #eee; margin-top: 45px; margin-bottom: 15px; padding: 5px;">
												<div style="text-align: left; padding: 15px 5px; font-size: 15px;">
												  <div style="font-family: Helvetica; font-weight: 400; color: green">Contract Name: <span style="color: #777;">${contractName}</span></div>
												  <div style="font-family: Helvetica; font-weight: 400; color: green">Expiration Date: <span style="color: #777;">${expirationDate}</span></div>
												</div>
										  </div>
										  <div style="text-align: justify; padding: 2px 10px; font-family: Helvetica; font-weight: 400; color: #444; font-size: 16px;">
												<p>Formed by hospitality professionals, we are dedicated to helping your hotel achieve greater customer satisfaction increased QA scores, boost efficiencies and reduce cost.</p>
										  </div>
										  <div style="background: #111; margin-top: 5px; padding: 5px;">
											<div style="text-align: center; font-size: 13px; font-family: Helvetica; font-weight: 300; color: #999; padding: 25px;">
												  <div>
													PRIVACY STATEMENT&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TERM OF SERVICES
												  </div>
												  <div style="margin-top: 15px;">
													© 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259
												  </div>
											</div>
										  </div>
									</div>`
		);

		const { rows } = await query(Strquery);

		if (rows != null) {
			rows.forEach(function (element) {
                var mailOptions = {
                    from: 'tumistaffing@hotmail.com',
                    to: '',
                    subject: 'Contract Expiration Reminder',
                    html: htmlForEmail(element.Contracrt, element.Contract_Expiration_Date)
                };

				mailOptions.to = 'laurenmontenegro10@gmail.com';

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log('Id: ' + element.Id + ' error: ' + error);
					} else {
						console.log(
							'Id: ' + element.Id + ' ' + 'Email enviado: ' + info.response + ' ' + element.Electronic_Address
						);
					}
					console.log('\n');
				});

				mailOptions.to = 'laurenmontenegro10@gmail.com';

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log('Id: ' + element.Id + ' error: ' + error);
					} else {
						console.log(
							'Id: ' + element.Id + ' ' + 'Email enviado: ' + info.response + ' ' + element.Primary_Email
						);
					}
					console.log('\n');
				});
			});
		}

		ReturntoLead();
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Conection to BD
const pool = new pg.Pool(ConfigPg);
async function query(q) {
	const client = await pool.connect();
	let res;
	try {
		await client.query('BEGIN');
		try {
			res = await client.query(q);
			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		}
	} finally {
		client.release();
	}
	return res;
}

//Method Connect to table Company
//Method Connect to table Company
async function getCompanies(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select * from public."Company"  where "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "Name"';
		//	console.log('query de companies ', Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table BusinessCompany
async function getBusinessCompanies(args) {
	try {
		//console.log(args.IsActive);
		var strparam1, strparam2, strparam3, strparam4, strparam5;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id > 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Region >= 0) {
			strparam5 = args.Region;
		} else {
			strparam5 = null;
		}

		if (args.Id_Parent >= -1) {
			strparam4 = args.Id_Parent;
		}
		else if (args.Id_Parent == -2) {
			strparam4 = -2
		}
		else {
			strparam4 = null;
		}

		strparam3 = args.Contract_Status;

		if (strparam4 == -1) {
			Strquery =
				'SELECT * from public.vwBusinessCompany_Format  where "Region" = coalesce(' + strparam5 + ', "Region") and "Contract_Status" =coalesce(' +
				strparam3 +
				',"Contract_Status") and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and "Id" = coalesce(' +

				strparam2 +
				',"Id") and "Id_Parent" <> 0 order by "Name"';
		}
		else if (strparam4 == -2) {
			Strquery =
				'SELECT * from public.vwBusinessCompany_Format  where "Region" = coalesce(' + strparam5 + ', "Region") and "Contract_Status" =coalesce(' +
				strparam3 +
				',"Contract_Status") and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and "Id" = coalesce(' +
				strparam2 +
				',"Id") and "Id_Parent" not in (99999,0) order by "Name"';

		}
		else {
			Strquery =
				'SELECT * from public.vwBusinessCompany_Format  where "Region" = coalesce(' + strparam5 + ', "Region") and "Contract_Status" =coalesce(' +
				strparam3 +
				',"Contract_Status") and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and "Id" = coalesce(' +
				strparam2 +
				',"Id") and "Id_Parent" = coalesce(' +
				strparam4 +
				',"Id_Parent") order by "Name"';
		}

		console.log('query de companies ', Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsBusinessCompanies(args) {
	try {
		if (args) {
			console.log('estos son los args ', args);
			Strquery =
				'INSERT INTO public."BusinessCompany" ("Code", "Code01","Id_Contract","Id_Company","BusinessType","Name","Description","Start_Week","End_Week","Start_Date","Legal_Name","Country","State","City","Id_Parent","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","ImageURL","Location","Location01","Rate","Zipcode", "Fax", "Phone_Prefix", "Phone_Number", "Primary_Email","Contract_URL","Contract_File", "Insurance_URL", "Insurance_File", "Other_URL", "Other_File", "Other_Name", "Other01_URL","Other01_Name","Other01_File","Suite","Rooms","Contract_Status","Region") VALUES(' +
				args.input.Code +
				',' +
				args.input.Code01 +
				',' +
				args.input.Id_Contract +
				',' +
				args.input.Id_Company +
				',' +
				args.input.BusinessType +
				',' +
				args.input.Name +
				',' +
				args.input.Description +
				',' +
				args.input.Start_Week +
				',' +
				args.input.End_Week +
				',' +
				args.input.Start_Date +
				',' +
				args.input.Legal_Name +
				',' +
				args.input.Country +
				',' +
				args.input.State +
				',' +
				args.input.City +
				',' +
				args.input.Id_Parent +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				',' +
				args.input.ImageURL +
				',' +
				args.input.Location +
				',' +
				args.input.Location01 +
				',' +
				args.input.Rate +
				',' +
				args.input.Zipcode +
				',' +
				args.input.Fax +
				',' +
				args.input.Phone_Prefix +
				',' +
				args.input.Phone_Number +
				',' +
				args.input.Primary_Email +
				',' +
				args.input.Contract_URL +
				',' +
				args.input.Contract_File +
				',' +
				args.input.Insurance_URL +
				',' +
				args.input.Insurance_File +
				',' +
				args.input.Other_URL +
				',' +
				args.input.Other_Name +
				',' +
				args.input.Other_File +
				',' +
				args.input.Other01_URL +
				',' +
				args.input.Other01_Name +
				',' +
				args.input.Other01_File +
				',' +
				args.input.Suite +
				',' +
				args.input.Rooms +
				',' +
				args.input.Contract_Status +
				',' +
				args.input.Region +
				') RETURNING "Id", "Code", "Code01","Id_Contract","Id_Company","BusinessType","Name","Description","Start_Week","End_Week","Start_Date","Legal_Name","Country","State","City","Id_Parent","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","ImageURL","Location","Location01","Rate","Zipcode", "Fax", "Phone_Prefix", "Phone_Number", "Primary_Email","Contract_URL","Contract_File", "Insurance_URL", "Insurance_File", "Other_URL", "Other_Name", "Other_File", "Other01_URL", "Other01_Name", "Other01_File","Suite","Contract_Status","Region"';
			//console.log(Strquery);
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		//return rows;
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdBusinessCompanies(args) {
	try {
		if (args) {
			console.log('estos son los args upd ', args);
			Strquery =
				'UPDATE public."BusinessCompany" SET "Code"=' +
				args.input.Code +
				',"Code01"=' +
				args.input.Code01 +
				',"Id_Contract"=' +
				args.input.Id_Contract +
				',"Id_Company"=' +
				args.input.Id_Company +
				', "BusinessType"=' +
				args.input.BusinessType +
				', "Name"=' +
				args.input.Name +
				', "Description"=' +
				args.input.Description +
				', "Start_Week"=' +
				args.input.Start_Week +
				', "End_Week"=' +
				args.input.End_Week +
				', "Start_Date"=' +
				args.input.Start_Date +
				', "Legal_Name"=' +
				args.input.Legal_Name +
				', "Country"=' +
				args.input.Country +
				', "State"=' +
				args.input.State +
				', "City"=' +
				args.input.City +
				', "Id_Parent"=' +
				args.input.Id_Parent +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				', "ImageURL"=' +
				args.input.ImageURL +
				', "Location"=' +
				args.input.Location +
				', "Location01"=' +
				args.input.Location01 +
				', "Rate"=' +
				args.input.Rate +
				', "Zipcode"=' +
				args.input.Zipcode +
				', "Fax"=' +
				args.input.Fax +
				', "Phone_Prefix"=' +
				args.input.Phone_Prefix +
				', "Phone_Number"=' +
				args.input.Phone_Number +
				', "Primary_Email"=' +
				args.input.Primary_Email +
				', "Contract_URL"=' +
				args.input.Contract_URL +
				', "Contract_File"=' +
				args.input.Contract_File +
				', "Insurance_URL"=' +
				args.input.Insurance_URL +
				', "Insurance_File"=' +
				args.input.Insurance_File +
				', "Other_URL"=' +
				args.input.Other_URL +
				', "Other_Name"=' +
				args.input.Other_Name +
				', "Other_File"=' +
				args.input.Other_File +
				', "Other01_URL"=' +
				args.input.Other01_URL +
				', "Other01_Name"=' +
				args.input.Other01_Name +
				', "Other01_File"=' +
				args.input.Other01_File +
				',"Suite"=' +
				args.input.Suite +
				',"Rooms"=' +
				args.input.Rooms +
				',"Region"=' +
				args.input.Region +
				' where "Id"=' +
				args.input.Id;
			//console.log(Strquery);
		} else {
			console.log('Error Update Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdRegionBusinessCompanies(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."BusinessCompany" SET "Region"=' +
				args.Region +
				' where "Id"=' +
				args.Id;
		} else {
			console.log('Error Update Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}


async function DelBusinessCompanies(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."BusinessCompany" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
			console.log(Strquery);
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);

		DelBusinessCompaniesWithParent(args);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelBusinessCompaniesWithParent(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."BusinessCompany" SET "Id_Parent"= 99999 where "Id_Parent"=' + args.Id;
			console.log(Strquery);
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table ElectronicAddress
async function getElectronicAddress(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Related_Table >= 0) {
			strparam3 = args.Related_Table;
		} else {
			strparam3 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam4 = args.Id_Entity;
		} else {
			strparam4 = null;
		}

		Strquery =
			'select * from public."ElectronicAddress"  Where and "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Related_Table" = coalesce(' +
			strparam3 +
			',"Related_Table") and Id_Entity coalesce(' +
			strparam4 +
			',"Id_Entity")  and "Id" = coalesce(' +
			strparam2 +
			',"Id")';

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsElectronicAddress(args) {
	try {
		console.log('entro aqui');
		if (args) {
			Strquery =
				'INSERT INTO public."ElectronicAddress" ("Related_Table", "Id_Entity", "Electronic_Address_Type", "Electronic_Address", "IsPrimary", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Related_Table +
				',' +
				args.input.Id_Entity +
				',' +
				args.input.Electronic_Address_Type +
				',' +
				args.input.Electronic_Address +
				',' +
				args.input.IsPrimary +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')';
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdElectronicAddress(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."ElectronicAddress" SET "Related_Table"=' +
				args.input.Related_Table +
				',"Id_Entity"=' +
				args.input.Id_Entity +
				',"Electronic_Address_Type"=' +
				args.input.Electronic_Address_Type +
				', "Electronic_Address"=' +
				args.input.Electronic_Address +
				', "IsPrimary"=' +
				args.input.IsPrimary +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table PhoneNumbers
async function getPhoneNumbers(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Related_Table >= 0) {
			strparam3 = args.Related_Table;
		} else {
			strparam3 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam4 = args.Id_Entity;
		} else {
			strparam4 = null;
		}

		Strquery =
			'select * from public."PhoneNumbers" Where and "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Related_Table" = coalesce(' +
			strparam3 +
			',"Related_Table") and "Id_Entity" = coalesce(' +
			strparam4 +
			',"Id_Entity")  and "Id" = coalesce(' +
			strparam2 +
			',"Id")';

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsPhoneNumbers(args) {
	try {
		console.log('entro aqui');
		if (args) {
			Strquery =
				'INSERT INTO public."PhoneNumbers" ("Related_Table", "Id_Entity", "Phone_Type", "Phone_Prefix", "Phone_Number", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Related_Table +
				',' +
				args.input.Id_Entity +
				',' +
				args.input.Phone_Type +
				',' +
				args.input.Phone_Prefix +
				',' +
				args.input.Phone_Number +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')';
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdPhoneNumbers(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."PhoneNumbers" SET "Related_Table"=' +
				args.input.Related_Table +
				',"Id_Entity"=' +
				args.input.Id_Entity +
				',"Phone_Type"=' +
				args.input.Phone_Type +
				', "Phone_Prefix"=' +
				args.input.Phone_Prefix +
				', "Phone_Number"=' +
				args.input.Phone_Number +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Address
async function getAddress(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Related_Table >= 0) {
			strparam3 = args.Related_Table;
		} else {
			strparam3 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam4 = args.Id_Entity;
		} else {
			strparam4 = null;
		}

		Strquery =
			'select * from public."Address" Where and "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Related_Table" = coalesce(' +
			strparam3 +
			',"Related_Table") and Id_Entity = coalesce(' +
			strparam4 +
			',"Id_Entity")  and "Id" = coalesce(' +
			strparam2 +
			',"Id")';

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsAddress(args) {
	try {
		console.log('entro aqui');
		if (args) {
			Strquery =
				'INSERT INTO public."Address" ("Related_Table", "Id_Entity", "Address_Type", "Address", "Country" , "State" , "Region" , "City", "IsPrimary", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Related_Table +
				',' +
				args.input.Id_Entity +
				',' +
				args.input.Address_Type +
				',' +
				args.input.Address +
				',' +
				args.input.Country +
				',' +
				args.input.State +
				',' +
				args.input.Region +
				',' +
				args.input.City +
				',' +
				args.input.IsPrimary +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')';
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdAddress(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Address" SET "Related_Table"=' +
				args.input.Related_Table +
				',"Id_Entity"=' +
				args.input.Id_Entity +
				',"Address_Type"=' +
				args.input.Address_Type +
				', "Address"=' +
				args.input.Address +
				', "Country"=' +
				args.input.Country +
				', "State"=' +
				args.input.State +
				', "Region"=' +
				args.input.Region +
				', "City"=' +
				args.input.City +
				', "IsPrimary"=' +
				args.input.IsPrimary +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table ContactsCompany
async function getContacts(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam3 = args.Id_Entity;
		} else {
			strparam3 = null;
		}

		Strquery =
			'select * from public.vwContacts Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and  "Id_Entity" = coalesce(' +
			strparam3 +
			',"Id_Entity")  and "Id" = coalesce(' +
			strparam2 +
			',"Id")';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function getSupervisor(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id_Entity > 0) {
			strparam3 = args.Id_Entity;
		} else {
			strparam3 = null;
		}

		if (args.Id > 0) {
			Strquery =
				'select * from public.vwsupervisor Where "Id" <> (' +
				args.Id +
				')  and   "Id" not in (SELECT "Id" FROM public."Contacts" where "Id_Supervisor" =  ' +
				args.Id +
				') and   "Id" not in (SELECT "Id" FROM public."Contacts" where "Id_Supervisor" in (SELECT "Id" FROM public."Contacts" where "Id_Supervisor" = ' +
				args.Id +
				')) and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and  "Id_Entity" = coalesce(' +
				strparam3 +
				',"Id_Entity" )';
		}
		if (args.Id == 0) {
			Strquery =
				'select * from public.vwsupervisor Where "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and  "Id_Entity" = coalesce(' +
				strparam3 +
				',"Id_Entity" )';
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsContacts(args) {
	try {
		if (args) {
			console.log(args);
			Strquery =
				'INSERT INTO public."Contacts" ("Id_Entity", "First_Name", "Middle_Name", "Last_Name", "Electronic_Address", "Phone_Number", "Contact_Type" , "Contact_Title", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated", "Id_Supervisor", "Id_Deparment") VALUES(' +
				args.input.Id_Entity +
				',' +
				args.input.First_Name +
				',' +
				args.input.Middle_Name +
				',' +
				args.input.Last_Name +
				',' +
				args.input.Electronic_Address +
				',' +
				args.input.Phone_Number +
				',' +
				args.input.Contact_Type +
				',' +
				args.input.Contact_Title +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				',' +
				args.input.Id_Supervisor +
				',' +
				args.input.Id_Deparment +
				') RETURNING "Id","Id_Entity", "First_Name","Middle_Name","Last_Name", "Electronic_Address", "Phone_Number", "Contact_Type","Contact_Title" , "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated", "Id_Supervisor", "Id_Deparment"';
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdContacts(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Contacts" SET "Id_Entity"=' +
				args.input.Id_Entity +
				',"First_Name"=' +
				args.input.First_Name +
				',"Middle_Name"=' +
				args.input.Middle_Name +
				',"Last_Name"=' +
				args.input.Last_Name +
				',"Electronic_Address"=' +
				args.input.Electronic_Address +
				', "Phone_Number"=' +
				args.input.Phone_Number +
				', "Contact_Type"=' +
				args.input.Contact_Type +
				', "Contact_Title"=' +
				args.input.Contact_Title +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' , "Id_Supervisor"=' +
				args.input.Id_Supervisor +
				' , "Id_Deparment"=' +
				args.input.Id_Deparment +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		return err;
		console.log('Database ' + err);
		return err;
	}
}

async function DelContacts(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Contacts" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Catalog
async function getCatalog(args, user) {
	try {
		console.log('GetCatalog: ', user);
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select * from public."Catalogs" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "Id"';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsCatalog(args) {
	try {
		if (args) {
			Strquery =
				'INSERT INTO public."Catalogs" ( "Id_Company","Code", "Description", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Id_Company +
				',' +
				args.input.Code +
				',' +
				args.input.Description +
				',' +
				args.input.IsActive +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')';
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdCatalog(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Catalogs" SET "Code"=' +
				args.input.Code +
				',"Description"=' +
				args.input.Description +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelCatalog(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Catalog" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table CatalogItem
async function getCatalogItem(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4, strparam5, strparam6;
		var strParam5Query;
		console.log(args);
		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Id_Catalog >= 0) {
			strparam3 = args.Id_Catalog;
		} else {
			strparam3 = null;
		}

		if (args.Id_Parent >= 0) {
			strparam4 = args.Id_Parent;
		} else {
			strparam4 = null;
		}

		if (args.Id_Entity == undefined) {
			strparam6 = 'is null'
		} else { strparam6 = ' = ' + args.Id_Entity }


		//if (args.Value > 0) {
		if (typeof args.Value !== 'undefined') {
			strparam5 = args.Value;
			strParam5Query = ' and "Value" =  ' + strparam5 + ' OR "Value" IS NULL ';
		} else {
			strparam5 = null;
			strParam5Query = '';
			/*if (args.Value != '' || args.Value != null) {
				strparam5 = args.Value;
			} else {
				strparam5 = null;
			}*/
		}

		Strquery =
			'select * from public."CatalogItem" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and  "Id_Catalog" = coalesce(' +
			strparam3 +
			',"Id_Catalog")  and "Id" = coalesce(' +
			strparam2 +
			',"Id") and "Id_Parent" = coalesce(' +
			strparam4 +
			',"Id_Parent") and "Id_Entity" ' + strparam6 + ' ' + strParam5Query + 'order by "Id","Id_Catalog", "DisplayLabel"';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function getParentCatalogItem(args) {
	try {
		console.log('getParentCatalogItem estoy aqui ');

		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id_Catalog >= -2) {
			strparam2 = args.Id_Catalog;
		} else {
			strparam2 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam3 = args.Id_Entity;
		} else {
			strparam3 = null;
		}

		if (args.Id > 0) {
			Strquery =
				'select * from public."CatalogParent" Where "Id_Catalog" =  coalesce(' +
				strparam2 +
				',"Id_Catalog") and "Id" <> (' +
				args.Id +
				') and "Id" not in (SELECT "Id" FROM public."CatalogItem" where "Id_Parent" =  ' +
				args.Id +
				') and "Id" not in (SELECT "Id" FROM public."CatalogItem" where "Id_Parent" in (SELECT "Id" FROM public."CatalogItem" where "Id_Parent" = ' +
				args.Id +
				')) and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive")';
			console.log(Strquery);
		}
		if (args.Id == 0) {
			Strquery =
				'select * from public."CatalogParent" Where "Id_Catalog" =  coalesce(' +
				strparam2 +
				',"Id_Catalog") and "Id" <> (' +
				args.Id +
				') and "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") ';
			console.log(Strquery);
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsCatalogItem(args) {
	try {
		if (args) {

			if (args.input.Id_Entity == undefined) {
				args.input.Id_Entity = null
			}


			Strquery =
				'INSERT INTO public."CatalogItem" ( "Id_Catalog", "Id_Parent", "Name", "DisplayLabel", "Description", "Value", "Value01", "Value02", "Value03", "Value04", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated", "Id_Entity") VALUES(' +
				args.input.Id_Catalog +
				',' +
				args.input.Id_Parent +
				',' +
				args.input.Name +
				',' +
				args.input.DisplayLabel +
				',' +
				args.input.Description +
				',' +
				args.input.Value +
				',' +
				args.input.Value01 +
				',' +
				args.input.Value02 +
				',' +
				args.input.Value03 +
				',' +
				args.input.Value04 +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				',' +
				args.input.Id_Entity +
				') RETURNING "Id","Id_Catalog", "Id_Parent", "Name", "DisplayLabel", "Description", "Value", "Value01", "Value02", "Value03", "Value04", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated","Id_Entity"';
			console.log(Strquery);
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdCatalogItem(args) {
	try {
		if (args) {

			if (args.input.Id_Entity == undefined) {
				args.input.Id_Entity = null
			}


			Strquery =
				'UPDATE public."CatalogItem" SET "Id_Catalog"=' +
				args.input.Id_Catalog +
				',"Id_Parent"=' +
				args.input.Id_Parent +
				',"Name"=' +
				args.input.Name +
				',"DisplayLabel"=' +
				args.input.DisplayLabel +
				',"Description"=' +
				args.input.Description +
				', "Value"=' +
				args.input.Value +
				', "Value01"=' +
				args.input.Value01 +
				', "Value02"=' +
				args.input.Value02 +
				', "Value03"=' +
				args.input.Value03 +
				', "Value04"=' +
				args.input.Value04 +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				', "Id_Entity"=' +
				args.input.Id_Entity +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelCatalogItem(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."CatalogItem" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Position and rate of Company
async function getPosition(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam3 = args.Id_Entity;
		} else {
			strparam3 = null;
		}


		if (args.Id_Department >= 0) {
			strparam4 = args.Id_Department;
		} else {
			strparam4 = null;
		}

		Strquery =
			'select * from public."PositionRate" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and  "Id_Entity" = coalesce(' +
			strparam3 +
			',"Id_Entity")  and "Id" = coalesce(' +
			strparam2 +
			',"Id") and "Id_Department" = coalesce(' +
			strparam4 +
			',"Id_Department")';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsPosition(args) {
	try {
		if (args) {
			Strquery =
				'INSERT INTO public."PositionRate" ("Id_Entity", "Id_Department","Id_positionApplying" ,"Position", "Bill_Rate", "Pay_Rate", "Shift","IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated","Id_Contract","Comment") VALUES(' +
				args.input.Id_Entity +
				',' +
				args.input.Id_Department +
				',' +
				args.input.Id_positionApplying +
				',' +
				args.input.Position +
				',' +
				args.input.Bill_Rate +
				',' +
				args.input.Pay_Rate +
				',' +
				args.input.Shift +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				',' +
				args.input.Id_Contract +
				',' +
				args.input.Comment +
				') RETURNING "Id", "Id_Entity", "Id_Department","Id_positionApplying" ,"Position", "Bill_Rate", "Pay_Rate", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated"';
		} else {
			console.log('Error Insert Data');
		}
		console.log(Strquery);
		const { rows } = await query(Strquery);
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdPosition(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."PositionRate" SET "Id_Entity"=' +
				args.input.Id_Entity +
				',"Id_Department"=' +
				args.input.Id_Department +
				',"Id_positionApplying"=' +
				args.input.Id_positionApplying +
				',"Position"=' +
				args.input.Position +
				', "Bill_Rate"=' +
				args.input.Bill_Rate +
				', "Pay_Rate"=' +
				args.input.Pay_Rate +
				', "Shift"=' +
				args.input.Shift +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				', "Id_Contract"=' +
				args.input.Id_Contract +
				', "Comment"=' +
				args.input.Comment +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelPosition(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."PositionRate" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Roles
async function getRoles(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.Id_Company >= 0) {
			strparam3 = args.Id_Company;
		} else {
			strparam3 = null;
		}

		Strquery =
			'select * from public."Roles" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and  "Id_Company" = coalesce(' +
			strparam3 +
			',"Id_Company")  and "Id" = coalesce(' +
			strparam2 +
			',"Id")';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsRoles(args) {
	try {
		if (args) {
			Strquery =
				'INSERT INTO public."Roles" ("Id_Company", "Description", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Id_Company +
				',' +
				args.input.Description +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				') RETURNING "Id", "Id_Company", "Description", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated"';
		} else {
			console.log('Error Insert Data');
		}
		console.log(Strquery);
		const { rows } = await query(Strquery);
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdRoles(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Roles" SET "Id_Company"=' +
				args.input.Id_Company +
				',"Description"=' +
				args.input.Description +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelRoles(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Roles" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Forms
async function getForms(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select * from public."Forms" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "Code"';
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsForms(args) {
	try {
		if (args) {
			Strquery =
				'INSERT INTO public."Forms" ( "Code", "Name", "Value", "Value01", "Value02", "Value03", "Value04", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.Code +
				',' +
				args.input.Name +
				',' +
				args.input.Value +
				',' +
				args.input.Value01 +
				',' +
				args.input.Value02 +
				',' +
				args.input.Value03 +
				',' +
				args.input.Value04 +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')';
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdForms(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Forms" SET "Code"=' +
				args.input.Code +
				',"Name"=' +
				args.input.Name +
				', "Value"=' +
				args.input.Value +
				', "Value01"=' +
				args.input.Value01 +
				', "Value02"=' +
				args.input.Value02 +
				', "Value03"=' +
				args.input.Value03 +
				', "Value04"=' +
				args.input.Value04 +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelForms(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Forms" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table RolesForms
/*async function getRolesForms(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select * from public."RolesForms" Where  "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "IdRoles"';
		//console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsRolesForms(args) {
	try {
		console.log('InsRolesForms ', args);
		if (args) {
			Strquery =
				'INSERT INTO public."RolesForms" ("IdRoles", "IdForms", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated") VALUES(' +
				args.input.IdRoles +
				',' +
				args.input.IdForms +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				')  RETURNING "Id","IdRoles"';
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdRolesForms(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."RolesForms" SET "IdRoles"=' +
				args.input.IdRoles +
				',"IdForms"=' +
				args.input.IdForms +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Updated +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Insert Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelRolesForms(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."RolesForms" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}*/

async function getUsers(args) {
	try {
		var strparam1, strparam2, strparam3, strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.IsRecruiter >= 0) {
			strparam3 = args.IsRecruiter;
		} else {
			strparam3 = null;
		}

		if (args.IdRegion >= 0) {
			strparam4 = args.IdRegion;
		} else {
			strparam4 = null;
		}


		if (strparam4 == null) {
			Strquery =
				'select * from public."Users" Where "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and "Id" = coalesce(' +
				strparam2 +
				',"Id") and "IsRecruiter" = coalesce(' +
				strparam3
				+ ',"IsRecruiter") order by "Code_User"';
		} else {
			if(strparam4>0)
			{
			Strquery =
				'select * from public."Users" Where "IdRegion" =coalesce(' + strparam4 + ',"IdRegion") and  "IsActive" = coalesce(' +
				strparam1 +
				',"IsActive") and "Id" = coalesce(' +
				strparam2 +
				',"Id") and "IsRecruiter" = coalesce(' +
				strparam3
				+ ',"IsRecruiter") order by "Code_User"';
			}
		}
		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsUsers(args) {
	try {

		var isEmployee = false
		if ('isEmployee' in args.input)
			isEmployee = args.input.isEmployee

		const password = `PGP_SYM_ENCRYPT('TEMP','AES_KEY')`;
		Strquery =
			'INSERT INTO public."Users" ("Id_Entity", "Id_Contact", "Id_Roles", "Code_User", "Full_Name", "Electronic_Address", "Phone_Number", "Password", "Id_Language", "IsAdmin", "AllowDelete", "AllowInsert", "AllowEdit", "AllowExport", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated", "IsRecruiter", "IdRegion","IdSchedulesEmployees","IdSchedulesManager", "isEmployee" ) VALUES(' +
			args.input.Id_Entity +
			',' +
			args.input.Id_Contact +
			',' +
			args.input.Id_Roles +
			',' +
			args.input.Code_User +
			',' +
			args.input.Full_Name +
			',' +
			args.input.Electronic_Address +
			',' +
			args.input.Phone_Number +
			',' +
			password +
			',' +
			args.input.Id_Language +
			',' +
			args.input.IsAdmin +
			',' +
			args.input.AllowDelete +
			',' +
			args.input.AllowInsert +
			',' +
			args.input.AllowEdit +
			',' +
			args.input.AllowExport +
			',' +
			args.input.IsActive +
			',' +
			args.input.User_Created +
			',' +
			args.input.User_Updated +
			',' +
			args.input.Date_Created +
			',' +
			args.input.Date_Updated +
			',' +
			args.input.IsRecruiter +
			',' +
			args.input.IdRegion +
			',' +
			args.input.IdSchedulesEmployees +
			',' +
			args.input.IdSchedulesManager +
			',' +
			isEmployee +
			') RETURNING "Id","Id_Entity", "Id_Contact", "Id_Roles", "Code_User", "Full_Name", "Electronic_Address", "Phone_Number", "Password", "Id_Language", "IsAdmin", "AllowDelete", "AllowInsert", "AllowEdit", "AllowExport", "IsActive", "User_Created", "User_Updated", "Date_Created", "Date_Updated", "IsRecruiter", "IdRegion","IdSchedulesEmployees","IdSchedulesManager","isEmployee"';

		console.log(Strquery);
		const { rows } = await query(Strquery);

		if (args.input.idEmployee) {
			Strquery = 'UPDATE public."Employees" SET "idUsers"=' + rows[0].Id + ' where "id"=' + args.input.idEmployee;
			console.log(Strquery);
			const { rows2 } = await query(Strquery);
		}

		return rows[0];

	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdUsers(args) {
	try {
		var strparam1;

		var isEmployee = false
		if ('isEmployee' in args.input)
			isEmployee = args.input.isEmployee


		if (args) {
			// strparam1 = 'AES_KEY';
			Strquery =
				'UPDATE public."Users" SET "Id_Entity"=' +
				args.input.Id_Entity +
				',"Id_Contact"=' +
				args.input.Id_Contact +
				',"Id_Roles"=' +
				args.input.Id_Roles +
				',"Code_User"=' +
				args.input.Code_User +
				',"Full_Name"=' +
				args.input.Full_Name +
				', "Electronic_Address"=' +
				args.input.Electronic_Address +
				', "Phone_Number"=' +
				args.input.Phone_Number +
				', "Id_Language"=' +
				args.input.Id_Language +
				', "IsAdmin"=' +
				args.input.IsAdmin +
				', "AllowDelete"=' +
				args.input.AllowDelete +
				', "AllowInsert"=' +
				args.input.AllowInsert +
				', "AllowEdit"=' +
				args.input.AllowEdit +
				', "AllowExport"=' +
				args.input.AllowExport +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				', "IdRegion"=' +
				args.input.IdRegion +
				', "IsRecruiter"=' +
				args.input.IsRecruiter +
				', "IdSchedulesEmployees"=' +
				args.input.IdSchedulesEmployees +
				', "IdSchedulesManager"=' +
				args.input.IdSchedulesManager +
				', "isEmployee"=' +
				isEmployee +
				' where "Id"=' +
				args.input.Id;
		} else {
			console.log('Error Update Data');
		}
		console.log(Strquery);
		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdRegionUsers(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Users" SET "IdRegion" =' + args.IdRegion + 'where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}
		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdUsersPassword(args) {
	try {
		console.log(args.Password)
		const password = `PGP_SYM_ENCRYPT(` + args.Password + `)`;
		if (args) {
			Strquery =
				'UPDATE public."Users" SET "IsActive" = 1, "Password"=' + password + 'where "Id"=' +
				args.Id;
		} else {
			console.log('Error Update Data');
		}
		console.log('Strquery ' + Strquery);
		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelUsers(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Users" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table BusinessCompany
async function getContracts(args) {
	try {
		console.log(args.IsActive);
		var strparam1, strparam2, strparam3,strparam4;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		if (args.IdManagement >= 0) {
			strparam3 = args.IdManagement;
		} else {
			strparam3 = null;
		}

		if (args.Id_Entity >= 0) {
			strparam4 = args.Id_Entity;
		} else {
			strparam4 = null;
		}

		Strquery =
			' select * from public.vwcontracts_Format  where "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "IdManagement" = coalesce(' +
			strparam3 +
			',"IdManagement") and "Id_Entity" = coalesce(' +
			strparam4 +
			',"Id_Entity") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "Id"';

			console.log("getContracts ",Strquery)

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function CreateContracts(args) {
	try {
		var strparam1, strparam2;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select "Contracts"."Id","Token"."Token","Token"."Signatory", "Id_Company", "IdManagement","Id_Entity", "Contract_Name", "Contrat_Owner", "Id_User_Signed",(SELECT "Electronic_Address" FROM public."Contacts" where "Id"= "Contracts"."Id_User_Signed") as "Electronic_Address", "User_Signed_Title", "Signed_Date", "Contract_Status", "Contract_Start_Date", "Contract_Term", "Owner_Expiration_Notification", "Company_Signed", "Company_Signed_Date", "Id_User_Billing_Contact", "Billing_Street", "Billing_City", "Billing_State", "Billing_Zip_Code", "Billing_Country", "Contract_Terms", "Exhibit_B", "Exhibit_C", "Exhibit_D", "Exhibit_E", "Exhibit_F", "Client_Signature", "Company_Signature","Contract_Expiration_Date",(SELECT "Primary_Email" FROM public."Company" where "Id"= "Contracts"."Id_Company") as "Primary_Email"  from public."Contracts" inner join public."Token" on "Token"."Id_Contract" = "Contracts"."Id"  where "Contracts"."IsActive" = coalesce(' +
			strparam1 +
			',"Contracts"."IsActive") and "Contracts"."Id" = coalesce(' +
			strparam2 +
			',"Contracts"."Id") order by "Contracts"."Id"';


		const { rows } = await query(Strquery);
		var content = rows[0].Contract_Terms;

		Strfilename = './public/Contract_' + rows[0].Contract_Name.trim() + '.pdf';
		var StrfilnameHTML = './public/Contract_' + rows[0].Contract_Name.trim() + '.html';
		//var html = fs.readFileSync(content, 'utf8');

		var options = {
			format: 'Letter',
			font: 'Arial',
			size: 12,
			type: "pdf",             // allowed file types: png, jpeg, pdf
			quality: "75",           // only used for types png & jpeg
			orientation: 'portrait',
			zoomFactor: 1,
			border: {
				top: '0.98in', // default is 0, units: mm, cm, in, px
				right: '0.98in',
				bottom: '0.98in',
				left: '0.98in'
			}
		};

		pdf.create(content, options).toFile(Strfilename, function (err, res) {
			console.log('toFile');
			if (err) return console.log(err);
			console.log(res);
			console.log('PDF Created');
		});

		while (true) {
			try {
				fs.accessSync(Strfilename, fs.W_OK)
				return rows;
			} catch (e) {
				console.log("Sigue escribiendo", e)
			}
		}

	} catch (err) {
		console.log('Database ' + err);
		return err;
	}

}



//Method Connect to Send Contracts by emails
async function SendContracts(args) {
	try {
		console.log(args.IsActive);
		var strparam1, strparam2;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select "Contracts"."Id","Token"."Token","Token"."Signatory", "Id_Company", "Id_Entity", "Contract_Name", "Contrat_Owner", "Id_User_Signed",(SELECT "Electronic_Address" FROM public."Contacts" where "Id"= "Contracts"."Id_User_Signed") as "Electronic_Address", "User_Signed_Title", "Signed_Date", "Contract_Status", "Contract_Start_Date", "Contract_Term", "Owner_Expiration_Notification", "Company_Signed", "Company_Signed_Date", "Id_User_Billing_Contact", "Billing_Street", "Billing_City", "Billing_State", "Billing_Zip_Code", "Billing_Country", "Contract_Terms", "Exhibit_B", "Exhibit_C", "Exhibit_D", "Exhibit_E", "Exhibit_F", "Client_Signature", "Company_Signature","Contract_Expiration_Date",(SELECT "Primary_Email" FROM public."Company" where "Id"= "Contracts"."Id_Company") as "Primary_Email"  from public."Contracts" inner join public."Token" on "Token"."Id_Contract" = "Contracts"."Id"  where "Contracts"."IsActive" = coalesce(' +
			strparam1 +
			',"Contracts"."IsActive") and "Contracts"."Id" = coalesce(' +
			strparam2 +
			',"Contracts"."Id") order by "Contracts"."Id"';

		console.log(Strquery);

		const { rows } = await query(Strquery);

		var content = rows[0].Contract_Terms;
		Strfilename = './public/Contract_' + rows[0].Contract_Name.trim() + '.pdf';

		var mailOptions = {
			from: 'tumistaffing@hotmail.com',
			to: rows[0].Electronic_Address,
			subject: rows[0].Contract_Name.trim() + '.pdf',
			html:
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml">' +
				'' +
				'<head>' +
				'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
				'<meta name="viewport" content="width=device-width" />' +
				'<title>Title</title>' +
				'<link rel="stylesheet" href="css/default.css">' +
				'</head>' +
				'' +
				'<body>' +
				'<!-- <style> -->' +
				'' +
				'<table class="body" data-made-with-foundation>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<table class="container">' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Flogo-tumy.png?alt=media&token=b6a26a9d-9081-40f6-a4b5-fed2c3b84895"' +
				'alt="" class="logo" width="300px">' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="slogan">' +
				'What you want to do and what you can do... <br>' +
				'Is limited only by what you can dream' +
				'<h3 style="color: #ecc500;font-size: 32px;text-align: center;margin: $margin 0;">Welcome</h3>' +
				'<p>' +
				'We are in the process of setting you up as part of the Tummy family. <br>' +
				'We need youn to complete the following steps to get the process rolling' +
				'</p>' +
				'<a href="' +
				URLWeb +
				'/home/signature/?token=' +
				rows[0].Token.trim() +
				'&signatory=C">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Fstepper.jpg?alt=media&token=bc28b46f-d7c9-41c4-bd3e-76d45c8c7f9a"' +
				'width="400px;" alt="">' +
				'</a>' +
				'</center>' +
				'<center>' +
				'<table class="button">' +
				'<tr>' +
				'<td>' +
				'<table>' +
				'<tr>' +
				'<td>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="content">' +
				'Formed by hospitality professionals, we are dedicated to <br>' +
				'helping your hotel achieve greater customer satisfaction,<br>' +
				'increased QA scores, boost efficiencies and reduce cost.' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td class="">' +
				'<table>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<center style="color:#777;background-color: #000;padding: 50px 0;">' +
				'<table>' +
				'<tr>' +
				'<td class="text-center" style="text-align: center;">' +
				'PRIVACY STATEMENT' +
				'</td>' +
				'<td class="pipe text-center" style="text-align: center;">' +
				'|' +
				'</td>' +
				'<td class="text-center" style="text-align: center;">' +
				'TERM OF SERVICES' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td colspan="3" height="50px" style="vertical-align:middle" valign="middle">' +
				'&copy; 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</body>' +
				'</html>',
			attachments: [
				{
					filename: Strfilename,
					content: 'Some notes about this e-mail',
					path: Strfilename,
					contentType: 'text/plain'
				}
			]
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email enviado: ' + info.response);
			}
		});

		var mailOptions = {
			from: 'tumistaffing@hotmail.com',
			to: rows[0].Primary_Email,
			subject: rows[0].Contract_Name.trim() + '.pdf',
			html:
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml">' +
				'' +
				'<head>' +
				'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
				'<meta name="viewport" content="width=device-width" />' +
				'<title>Title</title>' +
				'<link rel="stylesheet" href="css/default.css">' +
				'</head>' +
				'' +
				'<body>' +
				'<!-- <style> -->' +
				'' +
				'<table class="body" data-made-with-foundation>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<table class="container">' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Flogo-tumy.png?alt=media&token=b6a26a9d-9081-40f6-a4b5-fed2c3b84895"' +
				'alt="" class="logo" width="300px">' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="slogan">' +
				'What you want to do and what you can do... <br>' +
				'Is limited only by what you can dream' +
				'<h3 style="color: #ecc500;font-size: 32px;text-align: center;margin: $margin 0;">Welcome</h3>' +
				'<p>' +
				'We are in the process of setting you up as part of the Tummy family. <br>' +
				'We need youn to complete the following steps to get the process rolling' +
				'</p>' +
				'<a href="' +
				URLWeb +
				'/home/signature/?token=' +
				rows[1].Token.trim() +
				'&signatory=E">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Fstepper.jpg?alt=media&token=bc28b46f-d7c9-41c4-bd3e-76d45c8c7f9a"' +
				'width="400px;" alt="">' +
				'</a>' +
				'</center>' +
				'<center>' +
				'<table class="button">' +
				'<tr>' +
				'<td>' +
				'<table>' +
				'<tr>' +
				'<td>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="content">' +
				'Formed by hospitality professionals, we are dedicated to <br>' +
				'helping your hotel achieve greater customer satisfaction,<br>' +
				'increased QA scores, boost efficiencies and reduce cost.' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td class="">' +
				'<table>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<center style="color:#777;background-color: #000;padding: 50px 0;">' +
				'<table>' +
				'<tr>' +
				'<td class="text-center" style="text-align: center;">' +
				'PRIVACY STATEMENT' +
				'</td>' +
				'<td class="pipe text-center" style="text-align: center;">' +
				'|' +
				'</td>' +
				'<td class="text-center" style="text-align: center;">' +
				'TERM OF SERVICES' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td colspan="3" height="50px" style="vertical-align:middle" valign="middle">' +
				'&copy; 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</body>' +
				'</html>',
			attachments: [
				{
					filename: Strfilename,
					content: 'Some notes about this e-mail',
					path: Strfilename,
					contentType: 'text/plain'
				}
			]
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email enviado: ' + info.response);
			}
		});



		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function InsContracts(args) {
	try {
		if (args) {
			console.log(args);
			Strquery =
				'INSERT INTO public."Contracts" ("Id_Company", "Contract_Name", "Contrat_Owner","IdManagement", "Id_Entity", "Id_User_Signed", "User_Signed_Title", "Signed_Date", "Contract_Status", "Contract_Start_Date", "Contract_Term", "Owner_Expiration_Notification", "Company_Signed","Company_Signed_Date", "Id_User_Billing_Contact", "Billing_Street", "Billing_City", "Billing_State", "Billing_Zip_Code", "Billing_Country", "Contract_Terms", "Exhibit_B", "Exhibit_C", "Exhibit_D", "Exhibit_E", "Exhibit_F","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","Contract_Expiration_Date","Id_Contract_Template","legalName") VALUES(' +
				args.input.Id_Company +
				',' +
				args.input.Contract_Name +
				',' +
				args.input.Contrat_Owner +
				',' +
				args.input.IdManagement +
				',' +
				args.input.Id_Entity +
				',' +
				args.input.Id_User_Signed +
				',' +
				args.input.User_Signed_Title +
				',' +
				args.input.Signed_Date +
				',' +
				args.input.Contract_Status +
				',' +
				args.input.Contract_Start_Date +
				',' +
				args.input.Contract_Term +
				',' +
				args.input.Owner_Expiration_Notification +
				',' +
				args.input.Company_Signed +
				',' +
				args.input.Company_Signed_Date +
				',' +
				args.input.Id_User_Billing_Contact +
				',' +
				args.input.Billing_Street +
				',' +
				args.input.Billing_City +
				',' +
				args.input.Billing_State +
				',' +
				args.input.Billing_Zip_Code +
				',' +
				args.input.Billing_Country +
				',' +
				args.input.Contract_Terms +
				',' +
				args.input.Exhibit_B +
				',' +
				args.input.Exhibit_C +
				',' +
				args.input.Exhibit_D +
				',' +
				args.input.Exhibit_E +
				',' +
				args.input.Exhibit_F +
				',' +
				args.input.IsActive +
				',' +
				args.input.User_Created +
				',' +
				args.input.User_Updated +
				',' +
				args.input.Date_Created +
				',' +
				args.input.Date_Updated +
				',' +
				args.input.Contract_Expiration_Date +
				',' +
				args.input.Id_Contract_Template +
				',' +
				args.input.legalName +
				') RETURNING "Id","Id_Company", "Contract_Name", "Contrat_Owner","IdManagement", "Id_Entity", "Id_User_Signed", "User_Signed_Title", "Signed_Date", "Contract_Status", "Contract_Start_Date", "Contract_Term", "Owner_Expiration_Notification", "Company_Signed","Company_Signed_Date", "Id_User_Billing_Contact", "Billing_Street", "Billing_City", "Billing_State", "Billing_Zip_Code", "Billing_Country", "Contract_Terms", "Exhibit_B", "Exhibit_C", "Exhibit_D", "Exhibit_E", "Exhibit_F","IsActive","User_Created","User_Updated","Date_Created","Date_Updated","Contract_Expiration_Date","Id_Contract_Template","legalName"';
		} else {
			console.log('Error Insert Data');
		}

		const { rows } = await query(Strquery);

		return rows[0];
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdContracts(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Contracts" SET "Id_Company"=' +
				args.input.Id_Company +
				',"Contract_Name"=' +
				args.input.Contract_Name +
				',"Contrat_Owner"=' +
				args.input.Contrat_Owner +
				',"IdManagement"=' +
				args.input.IdManagement +
				',"Id_Entity"=' +
				args.input.Id_Entity +
				', "Id_User_Signed"=' +
				args.input.Id_User_Signed +
				', "User_Signed_Title"=' +
				args.input.User_Signed_Title +
				', "Signed_Date"=' +
				args.input.Signed_Date +
				', "Contract_Status"=' +
				args.input.Contract_Status +
				', "Contract_Start_Date"=' +
				args.input.Contract_Start_Date +
				', "Contract_Term"=' +
				args.input.Contract_Term +
				', "Owner_Expiration_Notification"=' +
				args.input.Owner_Expiration_Notification +
				', "Company_Signed"=' +
				args.input.Company_Signed +
				', "Id_User_Billing_Contact"=' +
				args.input.Id_User_Billing_Contact +
				', "Billing_Street"=' +
				args.input.Billing_Street +
				', "Billing_City"=' +
				args.input.Billing_City +
				', "Billing_State"=' +
				args.input.Billing_State +
				', "Billing_Zip_Code"=' +
				args.input.Billing_Zip_Code +
				', "Billing_Country"=' +
				args.input.Billing_Country +
				', "Exhibit_B"=' +
				args.input.Exhibit_B +
				', "Exhibit_C"=' +
				args.input.Exhibit_C +
				', "Exhibit_D"=' +
				args.input.Exhibit_D +
				', "Exhibit_E"=' +
				args.input.Exhibit_E +
				', "Exhibit_F"=' +
				args.input.Exhibit_F +
				', "IsActive"=' +
				args.input.IsActive +
				', "User_Created"=' +
				args.input.User_Created +
				', "User_Updated"=' +
				args.input.User_Updated +
				', "Date_Created"=' +
				args.input.Date_Created +
				', "Date_Updated"=' +
				args.input.Date_Updated +
				', "Contract_Expiration_Date"=' +
				args.input.Contract_Expiration_Date +
				', "Id_Contract_Template"=' +
				args.input.Id_Contract_Template +
				', "legalName"=' +
				args.input.legalName +
				' where "Id"=' +
				args.input.Id;
			console.log(Strquery);
		} else {
			console.log('Error Update Data');
		}

		console.log(Strquery);

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdContractsExhibit(args) {
	try {
		if (args) {
			Strquery =
				'UPDATE public."Contracts" SET "Exhibit_B"=' +
				args.Exhibit_B +
				', "Exhibit_C"=' +
				args.Exhibit_C +
				', "Exhibit_D"=' +
				args.Exhibit_D +
				', "Exhibit_E"=' +
				args.Exhibit_E +
				', "Exhibit_F"=' +
				args.Exhibit_F +
				' where "Id"=' +
				args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function UpdContracstSignature(args) {
	try {
		var signatureclient = `'{signatureclient}'`;
		var signatureemploye = `'{signatureemploye}'`;

		var datesignatureclient = `'{datesignatureclient}'`;
		var signatureemployedate = `'{signatureemployedate}'`;

		var format = 'YYYY-MM-DD';

		var signature = "'<img src=" + args.Signature + "  width=250 height=100 />'";

		if (args) {
			if (args.Signatory == 'C') {
				Strquery =
					'UPDATE public."Contracts" SET "Contract_Terms" = replace(Replace("Contract_Terms",' +
					datesignatureclient +
					',to_char(Now(),' +
					`'` +
					format +
					`'` +
					')),' +
					signatureclient +
					',' +
					signature +
					'), "Client_Signature"=' +
					`'` +
					args.Signature +
					`'` +
					' where "Id"=' +
					args.Id;
				console.log(Strquery);
			}
			if (args.Signatory == 'E') {
				Strquery =
					'UPDATE public."Contracts" SET "Contract_Terms" = replace(Replace("Contract_Terms",' +
					signatureemployedate +
					',to_char(Now(),' +
					`'` +
					format +
					`'` +
					')),' +
					signatureemploye +
					',' +
					signature +
					'), "Company_Signature"=' +
					`'` +
					args.Signature +
					`'` +
					' where "Id"=' +
					args.Id;
				console.log(Strquery);
			}
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function DelContracts(args) {
	try {
		if (args) {
			Strquery = 'UPDATE public."Contracts" SET "IsActive"=' + args.IsActive + ' where "Id"=' + args.Id;
		} else {
			console.log('Error Update Data');
		}

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table ContractTemplate
async function getContractTemplate(args) {
	try {
		var strparam1, strparam2, strparam3;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select * from public."ContractsTemplates"  where "IsActive" = coalesce(' +
			strparam1 +
			',"IsActive") and "Id" = coalesce(' +
			strparam2 +
			',"Id") order by "Id"';

		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to table Tokens
async function ValidTokens(args) {
	try {
		var strparam1, strparam2;

		if (args.Token >= 0) {
			strparam1 = args.Token;
		} else {
			strparam1 = null;
		}

		if (args.IsActive >= 0) {
			strparam2 = args.IsActive;
		} else {
			strparam2 = null;
		}

		Strquery =
			' select "IsActive","Token","Id_Contract","Signatory" from public."Token" where "IsActive" = 1 and "Signatory" =' +
			args.Signatory +
			' and  "Token" = ' +
			args.Token;

		console.log(Strquery);
		const { rows } = await query(Strquery);
		return rows;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function CreatePdfContracts(args) {
	try {
		var strparam1, strparam2;

		if (args.IsActive >= 0) {
			strparam1 = args.IsActive;
		} else {
			strparam1 = null;
		}

		if (args.Id >= 0) {
			strparam2 = args.Id;
		} else {
			strparam2 = null;
		}

		Strquery =
			'select "Contracts"."Id","Token"."Token","Token"."Signatory", "Id_Company", "Id_Entity", "Contract_Name", "Contrat_Owner", "Id_User_Signed",(SELECT "Electronic_Address" FROM public."Contacts" where "Id"= "Contracts"."Id_User_Signed") as "Electronic_Address", "User_Signed_Title", "Signed_Date", "Contract_Status", "Contract_Start_Date", "Contract_Term", "Owner_Expiration_Notification", "Company_Signed", "Company_Signed_Date", "Id_User_Billing_Contact", "Billing_Street", "Billing_City", "Billing_State", "Billing_Zip_Code", "Billing_Country", "Contract_Terms", "Exhibit_B", "Exhibit_C", "Exhibit_D", "Exhibit_E", "Exhibit_F", "Client_Signature", "Company_Signature","Contract_Expiration_Date",(SELECT "Primary_Email" FROM public."Company" where "Id"= "Contracts"."Id_Company") as "Primary_Email"  from public."Contracts" inner join public."Token" on "Token"."Id_Contract" = "Contracts"."Id"  where "Contracts"."IsActive" = coalesce(' +
			strparam1 +
			',"Contracts"."IsActive") and "Contracts"."Id" = coalesce(' +
			strparam2 +
			',"Contracts"."Id") order by "Contracts"."Id"';

		console.log(Strquery);

		const { rows } = await query(Strquery);

		var content = rows[0].Contract_Terms;
		Strfilename = './public/Contract_' + rows[0].Contract_Name.trim() + '.pdf';

		var html = fs.readFileSync(content, 'utf8');
		var options = {
			format: 'Letter',
			border: {
				top: '0.98in', // default is 0, units: mm, cm, in, px
				right: '0.98in',
				bottom: '0.98in',
				left: '0.98in'
			}
		};
		if (fs.existsSync(Strfilename)) {
			fs.unlinkSync(Strfilename);
		}

		console.log('html listo ', html);

		pdf.create(html, options).toFile(Strfilename, function (err, res) {
			if (err) return console.log(err);
			console.log(res); // { filename: '/app/businesscard.pdf' }
		});

		return Strfilename;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

//Method Connect to Send Contracts by emails
/*async function CreateDocumentsPDF(args) {
	try {
		var content = args.contentHTML;
		Strfilename = './public/Documents/' + args.Name.trim() + '.pdf';

		console.log(fs.existsSync(Strfilename));
		if (fs.existsSync(Strfilename) == false) {


			pdfshift
				.convert(content, {
					landscape: false,
					use_print: true,
					margin: { left: '72px', right: '72px', top: '72px', bottom: '72px' }
				})
				.then(function (binary_file) {
					fs.writeFile(Strfilename, binary_file, 'binary', function () { });
				})
				.catch(function ({ message, code, response, errors = null }) { });

			while (true) {
				try {
					fs.accessSync(Strfilename, fs.W_OK);
					return rows;
				} catch (e) {
					console.log('Sigue escribiendo', e);
				}
			}
		}

		return Strfilename;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}*/

async function CreateDocumentsPDF(args) {
	try {
		var content = args.contentHTML;
		Strfilename = './public/Documents/' + args.Name.trim() + '.pdf';

		if (fs.existsSync(Strfilename) == false) {

			var options = {
				format: 'Letter',
				font: 'Arial',
				size: 12,
				type: "pdf",             // allowed file types: png, jpeg, pdf
				quality: "75",           // only used for types png & jpeg
				orientation: 'portrait',
				zoomFactor: 1,
				border: {
					top: '0.98in', // default is 0, units: mm, cm, in, px
					right: '0.98in',
					bottom: '0.98in',
					left: '0.98in'
				}
			};

			pdf.create(content, options).toFile(Strfilename, function (err, res) {
				console.log('toFile');
				if (err) return console.log(err);
				console.log(res);
				console.log('PDF Created');
			});

			while (true) {
				try {
					fs.accessSync(Strfilename, fs.W_OK)
					return Strfilename;
				} catch (e) {
					console.log("Sigue escribiendo", e)
				}
			}
		}

		return Strfilename;
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function SendEmail(args) {
	try {
		var mailOptions = {
			from: 'tumistaffing@hotmail.com',
			to: args.email,
			subject: args.title,
			html:
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml">' +
				'<head>' +
				'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
				'<meta name="viewport" content="width=device-width" />' +
				'<title>Title</title>' +
				'<link rel="stylesheet" href="css/default.css">' +
				'</head>' +
				'<body>' +
				'<!-- <style> -->' +
				'<table class="body" data-made-with-foundation>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<table class="container">' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Flogo-tumy.png?alt=media&token=b6a26a9d-9081-40f6-a4b5-fed2c3b84895"' +
				'alt="" class="logo" width="300px">' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="slogan">' +
				'What you want to do and what you can do... <br>' +
				'Is limited only by what you can dream' +
				'<h3 style="color: #ecc500;font-size: 32px;text-align: center;margin: $margin 0;">Welcome</h3>' +
				'<p>' +
				'We are in the process of setting you up as part of the Tummy family. <br>' +
				'We need youn to complete the following steps to get the process rolling' +
				'</p>' +
				'<h3 style="color: #297560;font-size: 16px;text-align: left;margin: $margin 0;">User:   ' +
				args.username +
				'</h3>' +
				'<h3 style="color: #297560;font-size: 16px;text-align: left;margin: $margin 0;">Password:   ' +
				args.password +
				'</h3>' +
				'<a href="' +
				URLWeb +
				'/login ">' +
				'<h3 style="color: #297560;font-size: 22px;text-align: center;margin: $margin 0;">Tumi Site</h3>' +
				'</a>' +
				'</center>' +
				'<center>' +
				'<table class="button">' +
				'<tr>' +
				'<td>' +
				'<table>' +
				'<tr>' +
				'<td>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="content">' +
				'Formed by hospitality professionals, we are dedicated to <br>' +
				'helping your hotel achieve greater customer satisfaction,<br>' +
				'increased QA scores, boost efficiencies and reduce cost.' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td class="">' +
				'<table>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<center style="color:#777;background-color: #000;padding: 50px 0;">' +
				'<table>' +
				'<tr>' +
				'<td class="text-center" style="text-align: center;">' +
				'PRIVACY STATEMENT' +
				'</td>' +
				'<td class="pipe text-center" style="text-align: center;">' +
				'|' +
				'</td>' +
				'<td class="text-center" style="text-align: center;">' +
				'TERM OF SERVICES' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td colspan="3" height="50px" style="vertical-align:middle" valign="middle">' +
				'&copy; 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</body>' +
				'</html>'
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email enviado: ' + info.response);
			}
		});

		return 'Email Send';
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function SendSMS(args) {
	const accountSid = 'AC4cc6bedd9ea4f990e3d49e24ec0b11bf';
	const authToken = '4c06477eab6453006fb21ff733745e00';
	const client = require('twilio')(accountSid, authToken);

	client.messages.create({
		body: args.msg,
		from: '+12028041551',
		to: args.number
	})
	.then(message => console.log(message.sid));
}

async function SendGenericEmail(args) {
	try {
		var mailOptions = {
			from: 'tumistaffing@hotmail.com',
			to: args.email,
			subject: "new shift for " + args.title,
			html:
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml">' +
				'<head>' +
				'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
				'<meta name="viewport" content="width=device-width" />' +
				'<title>Title</title>' +
				'<link rel="stylesheet" href="css/default.css">' +
				'</head>' +
				'<body>' +
				'<table class="body" data-made-with-foundation>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<table class="container">' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Flogo-tumy.png?alt=media&token=b6a26a9d-9081-40f6-a4b5-fed2c3b84895" alt="" class="logo" width="300px">' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="slogan">' +
				'What you want to do and what you can do... <br> Is limited only by what you can dream ' +
				'<h3 style="color: #ecc500;font-size: 32px;text-align: center;">A New Shift Has Been Assigned To You</h3>' +
				'<h3 style="color:black;font-size:18px;text-align: center;">' + args.Hotel + '</h3>' +
				'<table style="border-collapse: collapse; width: 70%; height: 100px;" border="1">' +
				'<tbody>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">Shift #:</td>' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.shift + '</td>' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">Department:</td>' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.Department + '</td>' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">Title</td>' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.title + '</td>' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">Start Date:</td>' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.StartDate + '</td>' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">End Date</td> ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.ToDate + '</td > ' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;"> Shift Start</td > ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.ShiftStart + '</td > ' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">Shift End</td > ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.ShiftEnd + '</td > ' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;"> Workdays:</td > ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.Workdays + '</td > ' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;"> Supervisor:</td > ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.supervisor + '</td > ' +
				'</tr>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;"> Special Comments:</td > ' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' + args.specialComment + '</td > ' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'<table style="border-collapse: collapse; width: 100%; height: 60px;" border="0">' +
				'<tbody>' +
				'<tr style="height: 18px;">' +
				'<td style="width: 234.483px; text-align: right; height: 18px;">' +
				'<a style="text-decoration: underline;text-decoration-color: green; "' +
				'<a href="' +
				URLAccept +
				'/true/' + args.shift + ' ">' +
				'<h3 style="font-weight: bold;color: green;font-size: 22px;text-align: center;">Accept Shift</h3>' +
				'</a>' +
				'</td>' +
				'<td style="width: 234.467px; text-align: left; height: 18px;">' +
				'<a style="text-decoration: underline;text-decoration-color: red; "' +
				'<a href="' +
				URLAccept +
				'/false/' + args.shift + ' ">' +
				'<h3 style="font-weight: bold; color: red;font-size: 22px;text-align: center;">Reject Shift</h3>' +
				'</a>' +
				'</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'</center>' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper" style="color:#777;background-color: #000;padding: 30px 0;">' +
				'<table>' +
				'<tr>' +
				'<td class="text-center" style="text-align: center;">PRIVACY STATEMENT</td>' +
				'<td class="pipe text-center" style="text-align: center;">|</td>' +
				'<td class="text-center" style="text-align: center;">TERM OF SERVICES</td>' +
				'</tr>' +
				'<tr>' +
				'<td colspan="3" height="30px" style="vertical-align:middle" valign="middle">&copy; 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259 </td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</body>' +
				'</html>'
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email enviado: ' + info.response);
			}
		});

		return 'Email Send';
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

async function SendWorkOrderFilledEmail(args) {
	try {
		console.log("Informacion de los args ", args)

		var mailOptions = {
			from: 'tumistaffing@hotmail.com',
			to: args.email,
			subject: args.title,
			html:
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">' +
				'<html xmlns="http://www.w3.org/1999/xhtml">' +
				'<head>' +
				'<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' +
				'<meta name="viewport" content="width=device-width" />' +
				'<title>Title</title>' +
				'<link rel="stylesheet" href="css/default.css">' +
				'</head>' +
				'<body>' +
				'<table class="body" data-made-with-foundation>' +
				'<tr>' +
				'<td class="float-center" align="center" valign="top">' +
				'<table class="container">' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper">' +
				'<img src="https://firebasestorage.googleapis.com/v0/b/tumiapp-66cd6.appspot.com/o/files%2Flogo-tumy.png?alt=media&token=b6a26a9d-9081-40f6-a4b5-fed2c3b84895" alt="" class="logo" width="300px">' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'<tr>' +
				'<td>' +
				'<center class="slogan">' +
				'What you want to do and what you can do... <br> Is limited only by what you can dream ' +
				'<h3 style="color:#17b221;font-size: 26px;text-align: center;">' + args.title + ' and we are pleased to announce <br>' +
				'that the following team member has been assigned to your order:</h3>' +
				'<table style="border-collapse: collapse; width: 50%; height: 50px;" border="0">' +
				'<tbody>' +
				'<tr style="height: 18px;">' +
				'<td style="font-size: 26px;text-align:left">' + args.employees + '</td>' +
				'</tr>' +
				'</tbody>' +
				'</table>' +
				'</center>' +
				'<br>' +
				'<tr>' +
				'<td class="logo-wrapper">' +
				'<center class="logo-wrapper" style="color:#777;background-color: #000;padding: 30px 0;">' +
				'<table>' +
				'<tr>' +
				'<td class="text-center" style="text-align: center;">PRIVACY STATEMENT</td>' +
				'<td class="pipe text-center" style="text-align: center;">|</td>' +
				'<td class="text-center" style="text-align: center;">TERM OF SERVICES</td>' +
				'</tr>' +
				'<tr>' +
				'<td colspan="3" height="30px" style="vertical-align:middle" valign="middle">&copy; 2018 Tumi Staffing, Inc PO Box 592715 San Antonio, TX 78259 </td>' +
				'</tr>' +
				'</table>' +
				'</center>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</td>' +
				'</tr>' +
				'</table>' +
				'</body>' +
				'</html>'
		};

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log('Email enviado: ' + info.response);
			}
		});

		return 'Email Send';
	} catch (err) {
		console.log('Database ' + err);
		return err;
	}
}

const root = {
	getcompanies: getCompanies,

	getbusinesscompanies: getBusinessCompanies,
	insbusinesscompanies: InsBusinessCompanies,
	updbusinesscompanies: UpdBusinessCompanies,
	updregionbusinescompanies: UpdRegionBusinessCompanies,
	delbusinesscompanies: DelBusinessCompanies,

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
	delcontacts: DelContacts,
	getsupervisor: getSupervisor,

	getposition: getPosition,
	insposition: InsPosition,
	updposition: UpdPosition,
	delposition: DelPosition,

	getcatalog: getCatalog,
	inscatalog: InsCatalog,
	updcatalog: UpdCatalog,
	delcatalog: DelCatalog,

	getcatalogitem: getCatalogItem,
	inscatalogitem: InsCatalogItem,
	updcatalogitem: UpdCatalogItem,
	delcatalogitem: DelCatalogItem,
	getparentcatalogitem: getParentCatalogItem,

	getroles: getRoles,
	insroles: InsRoles,
	updroles: UpdRoles,
	delroles: DelRoles,

	getforms: getForms,
	insforms: InsForms,
	updforms: UpdForms,
	delforms: DelForms,

	/*getrolesforms: getRolesForms,
	insrolesforms: InsRolesForms,
	updrolesforms: UpdRolesForms,
	delrolesforms: DelRolesForms,*/

	getusers: getUsers,
	insusers: InsUsers,
	updusers: UpdUsers,
	delusers: DelUsers,
	upduserspassword: UpdUsersPassword,
	updregionusers: UpdRegionUsers,

	getcontracts: getContracts,
	inscontracts: InsContracts,
	updcontracts: UpdContracts,
	delcontracts: DelContracts,

	updcontracstexhibit: UpdContractsExhibit,
	updcontracstsignature: UpdContracstSignature,

	getcontracttemplate: getContractTemplate,

	sendcontracts: SendContracts,
	createcontracts: CreateContracts,

	validtokens: ValidTokens,

	createdocumentspdf: CreateDocumentsPDF,
	sendemail: SendEmail,
	sendgenericemail: SendGenericEmail,
	sendworkorderfilledemail: SendWorkOrderFilledEmail,
	SendSMS: SendSMS
};

module.exports = root;


export { SendGenericEmail };