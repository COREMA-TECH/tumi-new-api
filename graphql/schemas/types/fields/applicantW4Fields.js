import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';

const ApplicantW4Fields = {
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
	completed: {
		type: GraphQLBoolean,
		description: 'Document completed?'
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

export default ApplicantW4Fields;
