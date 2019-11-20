import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
const scheduleFields = {
	userId: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	code: {
		type: new GraphQLNonNull(GraphQLString)
	},
	IsActive: {
		type: GraphQLBoolean
	},
};
export default scheduleFields;
