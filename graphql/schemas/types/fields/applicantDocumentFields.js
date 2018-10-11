import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

const ApplicantDocumentFields = {
	url: {
		type: GraphQLString,
		description: 'URL of the document'
	},
	CatalogItemId: {
		type: GraphQLInt,
		description: 'Document Type Id'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantDocumentFields;
