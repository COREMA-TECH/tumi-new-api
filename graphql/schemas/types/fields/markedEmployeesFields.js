import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const markedEmployeesFields = {
	entityId: {
		type: GraphQLInt
	},
	markedDate: {
		type: GraphQLDate
	},
	inboundMarkTypeId: {
		type: GraphQLInt
	},
	inboundMarkTime: {
		type: GraphQLString
	},
	inboundMarkImage: {
		type: GraphQLString
	},
	outboundMarkTypeId: {
		type: GraphQLInt
	},
	outboundMarkTime: {
		type: GraphQLString
	},
	outboundMarkImage: {
		type: GraphQLString
	},
	positionId: {
		type: GraphQLInt
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
export default markedEmployeesFields;
