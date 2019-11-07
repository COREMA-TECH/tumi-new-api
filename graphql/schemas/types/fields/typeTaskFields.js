import { GraphQLInt, GraphQLString } from 'graphql';

const TokenFields = {
    name: {
        type: GraphQLString
    },
    description: {
        type: GraphQLString
    },
    userCreated: {
        type: GraphQLInt
    },
    userUpdated: {
        type: GraphQLInt
    }
};
export default TokenFields;
