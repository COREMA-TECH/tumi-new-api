import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
const VisitsFields = {
	startTime: {
        type: new GraphQLNonNull(GraphQLString)
    },
    endTime: {
        type: new GraphQLNonNull(GraphQLString)
    },
    url: {
        type: GraphQLString,
    },
    comment: {
        type: GraphQLString,
    },
    startLatitude: {
        type: GraphQLString,
    },
    startLongitude: {
        type: GraphQLString,
    },
    endLatitude: {
        type: GraphQLString,
    },
    endLongitude: {
        type: GraphQLString
    },
    isActive: {
        type: GraphQLBoolean
    },
    OpManagerId: {
        type: GraphQLInt
    },
    BusinessCompanyId: {
        type: GraphQLInt
    }
};
export default VisitsFields;
