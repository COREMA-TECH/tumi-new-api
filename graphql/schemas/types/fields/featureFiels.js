import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
const FeatureFields = {
    code: {
        type: new GraphQLNonNull(GraphQLString)
    },
    crud: {
        type: GraphQLString
    }
};
export default FeatureFields;
