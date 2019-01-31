import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
const UsersFields = {
	Id_Entity: {
		type: GraphQLInt
	},
	Id_Contact: {
		type: GraphQLInt
	},
	Id_Roles: {
		type: GraphQLInt
	},
	Code_User: {
		type: GraphQLString
	},
	Full_Name: {
		type: GraphQLString
	},
	Electronic_Address: {
		type: GraphQLString
	},
	Phone_Number: {
		type: GraphQLString
	},
	Password: {
		type: GraphQLString
	},
	Id_Language: {
		type: GraphQLInt
	},
	IsAdmin: {
		type: GraphQLInt
	},
	AllowDelete: {
		type: GraphQLInt
	},
	AllowInsert: {
		type: GraphQLInt
	},
	AllowEdit: {
		type: GraphQLInt
	},
	AllowExport: {
		type: GraphQLInt
	},
	IsActive: {
		type: GraphQLInt
	},
	User_Created: {
		type: GraphQLInt
	},
	User_Updated: {
		type: GraphQLInt
	},
	Date_Created: {
		type: GraphQLString
	},
	Date_Updated: {
		type: GraphQLString
	},
	IsRecruiter: {
		type: GraphQLInt
	},
	IdRegion: {
		type: GraphQLInt
	},
	isEmployee: {
		type: GraphQLBoolean
	},
	manageApp: {
		type: GraphQLBoolean
	}

};
export default UsersFields;
