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
      
      console.log(Strquery); 

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
