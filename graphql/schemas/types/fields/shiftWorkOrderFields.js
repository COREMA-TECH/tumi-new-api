import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
const shiftWorkOrderFields = {
	shiftId: {
		type: GraphQLInt
	},
	workOrderId: {
		type: GraphQLInt
	}
};
export default shiftWorkOrderFields;
