import { GraphQLInt, GraphQLString } from 'graphql';
const contactsFields = {
	Id_Entity: {
		type: GraphQLInt
	},
	First_Name: {
		type: GraphQLString
	},
	Middle_Name: {
		type: GraphQLString
	},
	Last_Name: {
		type: GraphQLString
	},
	Electronic_Address: {
		type: GraphQLString
	},
	Phone_Number: {
		type: GraphQLString
	},
	Contact_Type: {
		type: GraphQLInt
	},
	Id_Supervisor: {
		type: GraphQLInt
	},
	Id_Deparment: {
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
	Contact_Title: {
		type: GraphQLInt
	},
	ApplicationId: {
		type: GraphQLInt
	}
};
export default contactsFields;
