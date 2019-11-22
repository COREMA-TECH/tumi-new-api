import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
const formFields = {
    applicationId: {
        type: GraphQLInt
    },
    hiredStateId: {
        type: GraphQLInt
    },
    userCreated: {
        type: GraphQLInt
    },
    userUpdated: {
        type: GraphQLInt
    },
    isActive: {
        type: GraphQLBoolean
    }
};
export default formFields;
