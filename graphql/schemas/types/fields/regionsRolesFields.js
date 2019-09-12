import { GraphQLInt, GraphQLBoolean } from 'graphql';

const RegionsRolesFields = {
    isActive: {
        type: GraphQLBoolean
    },
    RolId: {
        type: GraphQLInt
    },
    RegionId: {
        type: GraphQLInt
    }
};
export default RegionsRolesFields;