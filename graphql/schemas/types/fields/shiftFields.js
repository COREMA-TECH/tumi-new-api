import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';
const shiftFields = {
	entityId: {
		type: GraphQLInt
	},
	title: {
		type: GraphQLString
	},
	color: {
		type: GraphQLString
	},
	status: {
		type: GraphQLInt
	},
	idPosition: {
		type: GraphQLInt
	},
	startDate: {
		type: GraphQLDate
	},
	endDate: {
		type: GraphQLDate
	},
	dayWeek: {
		type: GraphQLString
	},
	comment: {
		type: GraphQLString
	},
	isTemplate: {
		type: GraphQLBoolean
	},
	isActive: {
		type: GraphQLBoolean
	},
	departmentId: {
		type: GraphQLInt
	},
	createdAt: {
		type: (GraphQLString)
	}
};
export default shiftFields;
