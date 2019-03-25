import {GraphQLNonNull, GraphQLString} from 'graphql';

const punchesCSVFields = {
    path: {
        type: new GraphQLNonNull(GraphQLString)
    },
};

export default punchesCSVFields;