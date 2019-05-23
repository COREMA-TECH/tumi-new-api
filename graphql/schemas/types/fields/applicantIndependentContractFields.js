import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

const ApplicantIndependentContractFields = {
    url: {
        type: GraphQLString,
        description: 'URL of the document'
    },
    fileName: {
        type: GraphQLString,
        description: 'Name of the document'
    },
    fileExtension: {
        type: GraphQLString,
        description: 'Extension of the file'
    },
    ApplicationId: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'Application Id'
    },
    html: {
        type: GraphQLString,
        description: 'Html'
    }
};

export default ApplicantIndependentContractFields;
