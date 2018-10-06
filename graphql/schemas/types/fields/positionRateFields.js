import { GraphQLInt, GraphQLString, GraphQLFloat } from 'graphql';
const PositionRateFields = {
	Id_Contract: {
		type: GraphQLInt
	},
	Id_Entity: {
		type: GraphQLInt
	},
	Id_Department: {
		type: GraphQLInt
	},
	Position: {
		type: GraphQLString
	},
	Bill_Rate: {
		type: GraphQLFloat
	},
	Pay_Rate: {
		type: GraphQLFloat
	},
	Shift: {
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
export default PositionRateFields;
