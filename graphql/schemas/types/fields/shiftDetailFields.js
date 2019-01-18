import { GraphQLInt, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';
const shiftDetailFields = {
	startDate: {
		type: GraphQLDate
	},
	endDate: {
		type: GraphQLDate
	},
	startTime: {
		type: GraphQLString
	},
	endTime: {
		type: GraphQLString
	},
	ShiftId: {
		type: GraphQLInt
	},
	color: {
		type: GraphQLString,
	},
	status: {
		type: GraphQLString,
	}

};
export default shiftDetailFields;
