import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { ApplicationMutation, ApplicantLanguageMutation, ElectronicAddressMutation } from './mutations/';
import { ApplicationQuery, ApplicantLanguageQuery, ElectronicAddressQuery } from './queries/';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ApplicantLanguageQuery,
		...ElectronicAddressQuery
	}
});
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: {
		...ApplicationMutation,
		...ApplicantLanguageMutation,
		...ElectronicAddressMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export default IndexSchema;
