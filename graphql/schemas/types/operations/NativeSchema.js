const { buildSchema } = require('graphql');

const NativeSchema = buildSchema(`
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
	input iParamPR {
	Id : Int
	Id_Entity : Int
	Id_Department : Int
	Id_positionApplying : Int
	Position: String
	Bill_Rate: Float
	Pay_Rate: Float
	Shift: String
	Comment: String
	IsActive : Int
	User_Created : Int
	User_Updated : Int
	Date_Created: String
	Date_Updated: String
	Id_Contract: Int
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
	First_Name: String
	Middle_Name: String 
	Last_Name: String
	Electronic_Address: String
	Phone_Number: String
	Contact_Type: Int
	Contact_Title: Int
	IsActive: Int
	User_Created: Int
	User_Updated: Int
	Date_Created: String
	Date_Updated: String
	Id_Supervisor: Int
	Id_Deparment: Int
	}
	input iParamCI{
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
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated : String
	}
	input iForms{
		Id: Int
		Code: String
		Name: String
		Value: String
		Value01: String
		Value02: String
		Value03: String
		Value04: String
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated : String
	}
	input iParamCatalog{
		Id: Int
		Id_Company: Int
		Code: String
		Description: String
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated : String
	}
	input iParamBC {
		  Id: Int
		  Code: String
		Code01: String
		Id_Contract: Int
		Id_Company: Int
		BusinessType: Int
		Name: String
		Description: String
		Start_Week: Int
		End_Week: Int
		Start_Date: String
		Legal_Name: String
		Region:Int
		Country: Int
		State: Int
		City: Int
		Id_Parent: Int
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated: String
		ImageURL: String
		Location: String
		Location01: String
		Rate: Float
		Zipcode: String
		Fax: String
		Phone_Prefix: String
		Phone_Number:String
		Primary_Email: String
		
		Contract_URL: String
		Contract_File: String
		
		Insurance_URL: String
		Insurance_File: String

		Other_URL:String
		Other_Name: String
		Other_File: String

		Other01_URL: String
		Other01_Name: String
		Other01_File: String

		Suite:String
		Rooms: Int
		Contract_Status : String
	}
	input iRoles{
		Id : Int
		Id_Company : Int
		Description : String
		IsActive : Int
		User_Created : Int
		User_Updated : Int
		Date_Created: String
		Date_Updated: String
	}
	input iCompany{
			Id : Int
			Name : String
			Description : String
			LegalName : String
			CompanyType: Int
			Country : Int
			State : Int
			Region : Int
			City : Int
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
	}
	input iRolesForms{
			Id : Int
			IdRoles : Int
			IdForms : Int
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
	}
	input iUsers{
		Id: Int
		Id_Entity: Int
		Id_Contact: Int
		Id_Roles: Int
		Code_User: String
		Full_Name: String
		Electronic_Address: String
		Phone_Number: String
		Password: String
		Id_Language: Int
		IsAdmin: Int
		AllowDelete: Int
		AllowInsert: Int
		AllowEdit: Int
		AllowExport: Int
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated: String
		IsRecruiter: Int
		IdRegion: Int
		IdSchedulesEmployees: Int
		IdSchedulesManager: Int
	}
	input iContracts{
			Id: Int
			Id_Company: Int
			Contract_Name: String
			Contrat_Owner: String
			IdManagement: Int
			Id_Entity: Int
			Id_User_Signed: Int
			User_Signed_Title: String
			Signed_Date: String
			Contract_Status: String
			Contract_Start_Date: String
			Contract_Term: Int
			Owner_Expiration_Notification: Int
			Company_Signed: String
			Company_Signed_Date: String
			Id_User_Billing_Contact: Int
			Billing_Street: String
			Billing_City: Int
			Billing_State: Int
			Billing_Zip_Code: Int
			Billing_Country: Int
			Contract_Terms: String
			Exhibit_B: String
			Exhibit_C: String
			Exhibit_D: String
			Exhibit_E: String
			Exhibit_F: String
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			Client_Signature: String
			Company_Signature: String
			Contract_Expiration_Date: String
			Electronic_Address: String
			Primary_Email: String
			Id_Contract_Template: Int
	}
	input iContractsTemplates{
		Id: Int
		Name:String
		Contract_Template: String
		Exhibit_B: String
		Exhibit_C: String
		Exhibit_D: String
		Exhibit_E: String
		Exhibit_F: String
		Exhibit_G: String
		IsActive: Int
	}
	type Query
	{
		getcontracts(Id:Int,IsActive:Int): [Contracts]
		getcompanies(Id:Int,IsActive:Int): [Company]
		getbusinesscompanies(Id:Int,IsActive:Int,Contract_Status:String,Id_Parent:Int): [BusinessCompany]
		getelectronicaddress(Id:Int,IsActive:Int, Related_Table: String, Id_Entity :Int): [ElectronicAddress]
		getphonenumbers(Id:Int,IsActive:Int,Related_Table:String,Id_Entity :Int): [PhoneNumbers]
		getaddress(Id:Int,IsActive:Int,Related_Table: String, Id_Entity :Int): [Address]
		getcontacts(Id:Int,IsActive:Int, Id_Entity :Int): [Contacts]
		getposition(Id:Int,IsActive:Int, Id_Entity :Int): [PositionRate]
		getsupervisor(Id:Int,IsActive:Int,Id_Entity :Int): [Supervisor]
		getparentcatalogitem(Id:Int,Id_Catalog: Int,IsActive:Int): [CatalogParent]
		getcatalog(Id:Int,IsActive:Int): [Catalog]
		getcatalogitem(Id:Int,IsActive:Int,Id_Catalog:Int,Id_Parent:Int,Value:String): [CatalogItem]
		getroles(Id:Int,IsActive:Int,Id_Company:Int): [Roles]
		getforms(Id:Int,IsActive:Int): [Forms]
		getrolesforms(Id:Int,IsActive:Int): [RolesForms]
		getusers(Id:Int,IsActive:Int, IsRecruiter:Int): [Users]
		getcontracttemplate(Id:Int,IsActive:Int): [ContractsTemplates]
		sendcontracts(Id:Int,IsActive:Int): [Contracts]
		createcontracts(Id:Int,IsActive:Int): [Contracts]
		validtokens(Token:String,Signatory:String):[Token]
		createdocumentspdf(contentHTML:String,Name:String): String
		sendemail(username:String,password:String,email:String,title:String): String
		sendgenericemail(StartDate:String,ToDate:String,ShiftStart:String,ShiftEnd:String,shift:String,email:String,title:String): String
	}
	type Mutation{
		insbusinesscompanies(input: iParamBC): BusinessCompany 
		updbusinesscompanies(input: iParamBC): BusinessCompany
		delbusinesscompanies(Id:Int,IsActive:Int): BusinessCompany
		inselectronicaddress(input: iParamEA): ElectronicAddress
		updelectronicaddress(input: iParamEA): ElectronicAddress
		insphonenumbers(input: iParamPN): PhoneNumbers
		updphonenumbers(input: iParamPN): PhoneNumbers
		insaddress(input: iParamA): Address
		updaddress(input: iParamA): Address
		inscontacts(input: iParamC): Contacts
		updcontacts(input: iParamC): Contacts
		delcontacts(Id:Int,IsActive:Int): Contacts
		insposition(input: iParamPR): PositionRate
		updposition(input: iParamPR): PositionRate
		delposition(Id:Int,IsActive:Int): PositionRate
		inscatalog(input: iParamCatalog): Catalog
		updcatalog(input: iParamCatalog): Catalog
		delcatalog(Id:Int,IsActive:Int): Catalog
		
		
		inscatalogitem(input: iParamCI): CatalogItem
		updcatalogitem(input: iParamCI): CatalogItem
		delcatalogitem(Id:Int,IsActive:Int): CatalogItem
		insroles(input: iRoles): Roles
		updroles(input: iRoles): Roles
		delroles(Id:Int,IsActive:Int): Roles
		insforms(input: iForms): Forms
		updforms(input: iForms): Forms
		delforms(Id:Int,IsActive:Int): Forms
		insrolesforms(input: iRolesForms): RolesForms
		updrolesforms(input: iRolesForms): RolesForms
		delrolesforms(Id:Int,IsActive:Int): RolesForms
		insusers(input: iUsers): Users
		updusers(input: iUsers): Users
		delusers(Id:Int,IsActive:Int): Users
		upduserspassword(Id:Int, Password:String): Users
		inscontracts(input: iContracts): Contracts
		updcontracts(input: iContracts): Contracts
		delcontracts(Id:Int,IsActive:Int): Contracts
		updcontracstexhibit(Id:Int,Exhibit_B:String,Exhibit_C:String,Exhibit_D:String,Exhibit_E:String,Exhibit_F:String) : Contracts
		updcontracstsignature(Id:Int,Signature:String,Signatory:String) : Contracts
	}
	
	type Token{
		Id: Int
		Token:String
		IsActive: Int
		Id_Contract: Int
	}
	type ContractsTemplates{
		Id: Int
		Name:String
		Contract_Template: String
		Exhibit_B: String
		Exhibit_C: String
		Exhibit_D: String
		Exhibit_E: String
		Exhibit_F: String
		Exhibit_G: String
		IsActive: Int
	}
	type Contracts{
			Id: Int
			Id_Company: Int
			Token: String
			Contract_Name: String
			Contrat_Owner: String
			IdManagement: Int
			Id_Entity: Int
			Id_User_Signed: Int
			User_Signed_Title: String
			Signed_Date: String
			Contract_Status: String
			Contract_Start_Date: String
			Contract_Term: Int
			Owner_Expiration_Notification: Int
			Company_Signed: String
			Company_Signed_Date: String
			Id_User_Billing_Contact: Int
			Billing_Street: String
			Billing_City: Int
			Billing_State: Int
			Billing_Zip_Code: Int
			Billing_Country: Int
			Contract_Terms: String
			Exhibit_B: String
			Exhibit_C: String
			Exhibit_D: String
			Exhibit_E: String
			Exhibit_F: String
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			Client_Signature: String
			Company_Signature: String
			Contract_Expiration_Date: String
			Electronic_Address: String
			Primary_Email: String
			Id_Contract_Template: Int
	}
	type Company{
			Id : Int
			Name : String
			Description : String
			LegalName : String
			CompanyType: Int
			Country : Int
			State : Int
			Region : Int
			City : Int
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			Primary_Email: String
	}
	type BusinessCompany{
			Id: Int
			Code: String
			Code01: String
			Id_Contract: Int
			Id_Company: Int
			BusinessType: Int
			Name: String
			Description: String
			Start_Week: Int
			End_Week: Int
			Start_Date: String
			Legal_Name: String
			Region:Int
			Country: Int
			State: Int
			City: Int
			Id_Parent: Int
			Parent: String
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			ImageURL: String
			Address: String
			Location: String
			Location01: String
			Rate: Float
			Zipcode: String
			Fax: String
			Phone_Prefix: String
			Phone_Number:String
			Primary_Email: String
			Contract_URL: String
			Contract_File: String

			Insurance_URL: String
			Insurance_File: String

			Other_URL:String
			Other_Name: String
			Other_File: String

			Other01_URL: String
			Other01_Name: String
			Other01_File: String

			Suite:String
			Rooms: Int
			Contract_Status : String
	}
	type Catalog{
		Id: Int
		Id_Company: Int
		Code: String
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
			First_Name: String
			Middle_Name: String
			Last_Name: String
			Electronic_Address: String
			Phone_Number: String
			Type:String
			Contact_Type: Int
			Title: String
			Contact_Title: Int
			Department: String
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			Id_Supervisor: Int
			Id_Deparment: Int
	}
	type Supervisor{
			Id : Int
			Full_Name: String
			Id_Entity: Int
			First_Name: String
			Middle_Name: String
			Last_Name: String
			Electronic_Address: String
			Phone_Number: String
			Type:String
			Contact_Type: Int
			Title: String
			Contact_Title: Int
			Department: String
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
			Id_Supervisor: Int
			Id_Deparment: Int
	}
	type CatalogParent{
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
	type PositionRate{
		Id : Int
		Id_Contract: Int
		Id_Entity : Int
		Id_Department : Int
		Id_positionApplying : Int
		Position: String
		Bill_Rate: Float
		Pay_Rate: Float
		Shift: String
		Comment: String
		IsActive : Int
		User_Created : Int
		User_Updated : Int
		Date_Created: String
		Date_Updated: String
	}
	type Roles{
		Id : Int
		Id_Company : Int
		Description : String
		IsActive : Int
		User_Created : Int
		User_Updated : Int
		Date_Created: String
		Date_Updated: String
	}
	type Forms{
		Id: Int
		Code: String
		Name: String
		Value: String
		Value01: String
		Value02: String
		Value03: String
		Value04: String
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated : String
	}
	type RolesForms{
			Id : Int
			IdRoles : Int
			IdForms : Int
			IsActive: Int
			User_Created: Int
			User_Updated: Int
			Date_Created: String
			Date_Updated: String
	}
	type Users{
		Id: Int
		Id_Entity: Int
		Id_Contact: Int
		Id_Roles: Int
		Code_User: String
		Full_Name: String
		Electronic_Address: String
		Phone_Number: String
		Password: String
		Id_Language: Int
		IsAdmin: Int
		AllowDelete: Int
		AllowInsert: Int
		AllowEdit: Int
		AllowExport: Int
		IsActive: Int
		User_Created: Int
		User_Updated: Int
		Date_Created: String
		Date_Updated: String
		IsRecruiter: Int
		IdRegion: Int
		IdSchedulesEmployees: Int
		IdSchedulesManager: Int
	}



`);

export { NativeSchema };
