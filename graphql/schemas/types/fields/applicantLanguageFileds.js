import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

const ApplicantLanguageFields = {
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Form Id'
	},
	language: {
		type: new GraphQLNonNull(GraphQLString),
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
