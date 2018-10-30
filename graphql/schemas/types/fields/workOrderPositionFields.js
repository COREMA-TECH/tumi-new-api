import { GraphQLInt, GraphQLNonNull } from 'graphql';

const WorkOrderPostionFields = {
	userId: {
		type: new GraphQLNonNull(GraphQLInt)
	},

	status: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	quantity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	PositionRateId: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	WorkOrderId: {
		type: new GraphQLNonNull(GraphQLInt)
	}
};

export default WorkOrderPostionFields;
