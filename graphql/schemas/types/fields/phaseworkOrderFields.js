import { GraphQLInt, GraphQLString } from 'graphql';

const phaseworkOrderFields = {
    userId: {
        type: (GraphQLInt)
    },

    phaseworkOrderId: {
        type: (GraphQLInt)
    },

    createdAt: {
        type: (GraphQLString)
    },

    WorkOrderId: {
        type: (GraphQLInt)
    },
};

export default phaseworkOrderFields;
