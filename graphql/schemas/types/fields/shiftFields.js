import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
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
	}
};
export default shiftFields;
