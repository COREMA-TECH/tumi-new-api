import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';

const WorkOrderFields = {
	IdEntity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	userId: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	contactId: {
		type: GraphQLInt
	},
	date: {
		type: new GraphQLNonNull(GraphQLDate)
	},
	status: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	quantity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	shift: {
		type: new GraphQLNonNull(GraphQLString)
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
	},
	EspecialComment: {
		type: new GraphQLNonNull(GraphQLString)
	}

};

export default WorkOrderFields;
