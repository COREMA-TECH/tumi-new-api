import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';

const ApplicationAccountDocumentFields = {
    applicationAccountId: {
        type: GraphQLInt,
        description: "Application Account"
    },
    path: {
        type: GraphQLString,
        description: "URL to document"
    },
    name: {
        type: GraphQLString,
        description: "Document Name"
    },
    extension: {
        type: GraphQLString,
        description: "Document extension"
    },
};

export default ApplicationAccountDocumentFields;