const { buildSchema } = require('graphql');

const PublicSchema = buildSchema(`

	type Query
	{
		
		getvalid_users(Code_User:String,Password:String):User
	
	}
	
	

	type User{
		Token: String
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
		IdSchedulesEmployees:Int
		IdSchedulesManager:Int
		isEmployee: Boolean
		}

`);

export { PublicSchema };
