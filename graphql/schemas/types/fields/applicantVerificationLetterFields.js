import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';

const ApplicantVerificationLetterFields = {
    html: {
        type: GraphQLString,
        description: 'Html'
    },
    fileName: {
        type: GraphQLString,
        description: 'File Name'
    },
    ApplicationId: {
        type: new GraphQLNonNull(GraphQLInt),
        description: 'Application Id'
    },
};

export default ApplicantVerificationLetterFields;
