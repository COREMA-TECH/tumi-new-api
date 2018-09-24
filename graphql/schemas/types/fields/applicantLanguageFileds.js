import { GraphQLInt, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';

const ApplicantLanguageFilds = {
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

export default ApplicantLanguageFilds;
