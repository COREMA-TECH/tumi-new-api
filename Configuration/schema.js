const { buildSchema } = require('graphql');

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

input iParamPR {
Id : Int
Id_Entity : Int
Id_Department : Int
Position: String
Bill_Rate: Float
Pay_Rate: Float
IsActive : Int
User_Created : Int
User_Updated : Int
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
Id_Supervisor: Int
IsPrimary: Int
IsSecundary: Int
Id_Deparment: Int
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
	Zipcode: Int
	Fax: String
    Phone_Prefix: String
    Phone_Number:String
    Primary_Email: String
}

type Query
{
	getcompanies(Id:Int,IsActive:Int): [BusinessCompany]

	getelectronicaddress(Id:Int,IsActive:Int, Related_Table: String, Id_Entity :Int): [ElectronicAddress]
	getphonenumbers(Id:Int,IsActive:Int,Related_Table:String,Id_Entity :Int): [PhoneNumbers]
	getaddress(Id:Int,IsActive:Int,Related_Table: String, Id_Entity :Int): [Address]
	getcontacts(Id:Int,IsActive:Int, Id_Entity :Int): [Contacts]
	getposition(Id:Int,IsActive:Int, Id_Entity :Int): [PositionRate]

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
	delcontacts(Id:Int,IsActive:Int): Contacts


	insposition(input: iParamPR): PositionRate
	updposition(input: iParamPR): PositionRate
	delposition(Id:Int,IsActive:Int): PositionRate

	
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
		City: Int
		Id_Parent: Int
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
		Zipcode: Int
		Fax: String
	    Phone_Prefix: String
	    Phone_Number:String
	    Primary_Email: String
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
		Id_Supervisor: Int
		IsPrimary: Int
    	IsSecundary: Int
    	Id_Deparment: Int
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
	Id_Entity : Int
	Id_Department : Int
	Position: String
	Bill_Rate: Float
	Pay_Rate: Float
	IsActive : Int
	User_Created : Int
	User_Updated : Int
	Date_Created: String
	Date_Updated: String
}

`);


module.exports = schema;