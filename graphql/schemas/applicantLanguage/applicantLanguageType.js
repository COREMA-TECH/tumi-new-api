import { GraphQLInt, GraphQLNonNull, GraphQLInputObjectType, GraphQLObjectType } from 'graphql';

const fields = {
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
	}
};
const inputInsertType = new GraphQLInputObjectType({
	name: 'inputInsertApplicantLanguage',
	description: 'Inputs for Applicant Languages Mutation',

	fields: {
		...fields
	}
});

const inputUpdateType = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantLanguage',
	description: 'Inputs for Applicant Languages Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...fields
	}
});

const applicantLanguageType = new GraphQLObjectType({
	name: 'ApplicantLanguages',
	description: 'This is for Applicant Languages Table',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Language Id'
		},
		...fields
	}
});

export { inputInsertType, inputUpdateType, applicantLanguageType };
