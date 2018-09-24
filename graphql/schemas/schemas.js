import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import {
	ApplicationMutation,
	ApplicantLanguageMutation,
	ElectronicAddressMutation,
	ApplicantEducationMutation
} from './mutations/';
import { ApplicationQuery, ApplicantLanguageQuery, ElectronicAddressQuery, ApplicantEducationQuery } from './queries/';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ApplicantLanguageQuery,
		...ElectronicAddressQuery,
		...ApplicantEducationQuery
	}
});
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: {
		...ApplicationMutation,
		...ApplicantLanguageMutation,
		...ElectronicAddressMutation,
		...ApplicantEducationMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export default IndexSchema;
