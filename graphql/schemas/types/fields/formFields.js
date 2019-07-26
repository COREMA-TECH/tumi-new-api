import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
const formFields = {
	Code: {
		type: GraphQLString
	},
	Name: {
		type: GraphQLString
	},
	Value: {
		type: GraphQLString
	},
	Value01: {
		type: GraphQLString
	},

	Value02: {
		type: GraphQLString
	},
	Value03: {
		type: GraphQLString
	},
	Value04: {
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
	sort: {
		type: GraphQLInt
	},
	ParentId: {
		type: GraphQLInt
	},
	show: {
		type: GraphQLBoolean
	}
};
export default formFields;
