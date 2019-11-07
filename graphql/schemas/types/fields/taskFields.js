import { GraphQLInt, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';
import moment from 'moment';

const TokenFields = {
    email: {
        type: GraphQLString
    },
    phoneNumber: {
        type: GraphQLString
    },
    description: {
        type: GraphQLString
    },
    location: {
        type: GraphQLString
    },
    date: {
        type: GraphQLString
    },
    hour: {
        type: GraphQLString
    },
    typeTaskId: {
        type: GraphQLInt
    },
    userId: {
        type: GraphQLInt
    },
    userCreated: {
        type: GraphQLInt
    },
    userUpdated: {
        type: GraphQLInt
    }
};
export default TokenFields;
