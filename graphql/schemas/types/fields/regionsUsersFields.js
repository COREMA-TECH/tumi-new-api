import { GraphQLInt, GraphQLBoolean } from 'graphql';

const RegionsUsersFields = {
    isActive: {
        type: GraphQLBoolean
    },
    UserId: {
        type: GraphQLInt
    },
    RegionId: {
        type: GraphQLInt
    }
};
export default RegionsUsersFields;