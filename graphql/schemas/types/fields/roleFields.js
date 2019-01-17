import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';
const roleFields = {
	Id_Company: {
		type: GraphQLInt
	},
	Description: {
		type: GraphQLString
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
	}
};
export default roleFields;
