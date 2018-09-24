import { GraphQLInt, GraphQLNonNull } from 'graphql';

const ApplicantLanguageFields = {
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Form Id'
	},
	idLanguage: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Language Id'
	},
	writing: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Writing Skills %'
	},
	conversation: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Conversation Skils %'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantLanguageFields;
