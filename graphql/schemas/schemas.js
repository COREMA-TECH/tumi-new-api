import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import {
	ApplicationMutation,
	ApplicantLanguageMutation,
	ElectronicAddressMutation,
	ApplicantEducationMutation,
	ApplicantPreviousEmploymentMutation
} from './mutations/';
import {
	ApplicationQuery,
	ApplicantLanguageQuery,
	ElectronicAddressQuery,
	ApplicantEducationQuery,
	ApplicantPreviousEmploymentQuery
} from './queries/';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ApplicantLanguageQuery,
		...ElectronicAddressQuery,
		...ApplicantEducationQuery,
		...ApplicantPreviousEmploymentQuery
	}
});
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: {
		...ApplicationMutation,
		...ApplicantLanguageMutation,
		...ElectronicAddressMutation,
		...ApplicantEducationMutation,
		...ApplicantPreviousEmploymentMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export default IndexSchema;
