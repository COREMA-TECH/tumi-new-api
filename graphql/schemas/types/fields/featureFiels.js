import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
const FeatureFields = {
    code: {
        type: new GraphQLNonNull(GraphQLString)
    },
    RoleId: {
        type: GraphQLInt
    }
};
export default FeatureFields;
