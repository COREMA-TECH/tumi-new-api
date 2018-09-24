import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
const ElectronicAddressFields = {
	Related_Table: {
		type: new GraphQLNonNull(GraphQLString)
	},
	Id_Entity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Electronic_Address_Type: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Electronic_Address: {
		type: new GraphQLNonNull(GraphQLString)
	},
	IsPrimary: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	IsActive: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	User_Created: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	User_Updated: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Date_Created: {
		type: new GraphQLNonNull(GraphQLString)
	},
	Date_Updated: {
		type: new GraphQLNonNull(GraphQLString)
	}
};
export default ElectronicAddressFields;
