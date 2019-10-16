import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantLegalDocumentsFields = {
	fieldsData: {
		type: GraphQLString,
		description: 'Fields data'
    },
    url: {
		type: GraphQLString,
		description: 'Url'
    },
	userId: {
		type: GraphQLInt,
		description: 'User Id'
    },
    ApplicationDocumentTypeId: {
		type: GraphQLInt,
		description: 'User Id'
	},
	ApplicationId: {
		type: GraphQLInt,
		description: 'Application Id'
    },
    completed: {
		type: GraphQLBoolean,
		description: 'completed'
	}
};

export default ApplicantLegalDocumentsFields;