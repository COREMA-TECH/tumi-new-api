import { GraphQLInt, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const markedEmployeesFields = {
	entityId: {
		type: GraphQLInt
	},
	typeMarkedId: {
		type: GraphQLInt
	},
	markedDate: {
		type: GraphQLDate
	},
	markedTime: {
		type: GraphQLString
	},
	imageMarked: {
		type: GraphQLString
	},
	EmployeeId: {
		type: GraphQLInt
	},
	ShiftId: {
		type: GraphQLInt
	}
};
export default markedEmployeesFields;
