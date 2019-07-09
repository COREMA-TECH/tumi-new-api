import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
const employeesFields = {
	firstName: {
		type: GraphQLString
	},
	lastName: {
		type: GraphQLString
	},
	electronicAddress: {
		type: GraphQLString
	},
	mobileNumber: {
		type: GraphQLString
	},
	idRole: {
		type: GraphQLInt
	},
	isActive: {
		type: GraphQLBoolean
	},
	userCreated: {
		type: GraphQLInt
	},
	userUpdated: {
		type: GraphQLInt
	},
	Id_Deparment: {
		type: GraphQLInt
	},
	Contact_Title: {
		type: GraphQLInt
	},
	idUsers: {
		type: GraphQLInt
	},
	idEntity: {
		type: GraphQLInt
	},
	hireDate: {
		type: GraphQLString
	},
	startDate: {
		type: GraphQLString
	}

};
export default employeesFields;
