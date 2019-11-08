import { GraphQLInt, GraphQLString } from 'graphql';
const CatalogItemFields = {
	Id_Catalog: {
		type: GraphQLInt
	},
	Id_Parent: {
		type: GraphQLInt
	},
	Id_Entity: {
		type: GraphQLInt
	},
	Name: {
		type: GraphQLString
	},
	DisplayLabel: {
		type: GraphQLString
	},
	Description: {
		type: GraphQLString
	},
	Value: {
		type: GraphQLString
	},
	// Value01: {
	// 	type: GraphQLString
	// },
	// Value02: {
	// 	type: GraphQLString
	// },
	// Value03: {
	// 	type: GraphQLString
	// },
	// Value04: {
	// 	type: GraphQLString
	// },
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
export default CatalogItemFields;
