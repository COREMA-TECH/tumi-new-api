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
//module.exports = BusinessCompany;