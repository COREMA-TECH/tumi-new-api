import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantLegalDocumentsFields = {
	fieldsData: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Fields data'
	},
	url: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Url'
	},
	UserId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'User Id'
	},
	ApplicationDocumentTypeId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'User Id'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	},
	completed: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'completed'
	}
};

export default ApplicantLegalDocumentsFields;