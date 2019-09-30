import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const markedEmployeesFieldsOld = {
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
	},
	flag: {
		type: GraphQLBoolean
	},
	notes: {
		type: GraphQLString
	},
	key: {
		type: GraphQLString
	},
	approvedDate: {
		type: GraphQLDate
	}
};
export default markedEmployeesFieldsOld;
