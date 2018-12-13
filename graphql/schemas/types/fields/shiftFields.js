import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
const shiftFields = {
	idWorkOrder: {
		type: GraphQLInt
	},
	idPosition: {
		type: GraphQLInt
	},
	idEntity: {
		type: GraphQLInt
	},
	titleShift: {
		type: GraphQLString
	},
	startDate: {
		type: GraphQLString
	},
	endDate: {
		type: GraphQLString
	},
	startTime: {
		type: GraphQLString
	},
	endTime: {
		type: GraphQLString
	},
	isActive: {
		type: GraphQLBoolean
	}

};
export default shiftFields;
