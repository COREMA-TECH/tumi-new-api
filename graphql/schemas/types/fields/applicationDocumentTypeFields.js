import { GraphQLString } from 'graphql';

const ApplicationDocumentTypeFields = {
	name: {
		type: GraphQLString,
		description: 'Document Name'
	},
	description: {
		type: GraphQLString,
		description: 'Document Description'
	}
};

export default ApplicationDocumentTypeFields;