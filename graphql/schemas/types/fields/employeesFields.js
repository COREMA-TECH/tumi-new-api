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
	}
};
export default employeesFields;
