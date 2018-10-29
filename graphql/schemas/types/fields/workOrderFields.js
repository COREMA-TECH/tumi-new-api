import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';

const WorkOrderFields = {
	IdEntity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	date: {
		type: new GraphQLNonNull(GraphQLDate)
	},
	status: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	quantity: {
		type: new GraphQLNonNull(GraphQLFloat)
	},
	shift: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	startDate: {
		type: new GraphQLNonNull(GraphQLDate)
	},
	endDate: {
		type: new GraphQLNonNull(GraphQLDate)
	},
	needExperience: {
		type: new GraphQLNonNull(GraphQLBoolean)
	},
	needEnglish: {
		type: new GraphQLNonNull(GraphQLBoolean)
	},
	PositionRateId: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	comment: {
		type: new GraphQLNonNull(GraphQLString)
	}
};

export default WorkOrderFields;
