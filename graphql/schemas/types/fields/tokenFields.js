import { GraphQLInt, GraphQLString } from 'graphql';

const TokenFields = {
    Token: {
        type: GraphQLString
    },
    IsActive: {
        type: GraphQLInt
    },
    Id_Contract: {
        type: GraphQLInt
    },
    Signatory: {
        type: GraphQLString
    }
};
export default TokenFields;
