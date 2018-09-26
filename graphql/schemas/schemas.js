import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { NativeSchema } from './types/operations/NativeSchema';

import { makeExecutableSchema, addMockFunctionsToSchema, mergeSchemas } from 'graphql-tools';

import {
	ApplicationMutation,
	ApplicantLanguageMutation,
	ElectronicAddressMutation,
	ApplicantEducationMutation,
	ApplicantPreviousEmploymentMutation,
	ApplicantMilitaryServiceMutation,
	ApplicantSkillMutation
} from './mutations/';
import {
	ApplicationQuery,
	ApplicantLanguageQuery,
	ElectronicAddressQuery,
	ApplicantEducationQuery,
	ApplicantPreviousEmploymentQuery,
	ApplicantMilitaryServiceQuery,
	ApplicantSkillQuery
} from './queries/';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ApplicantLanguageQuery,
		...ElectronicAddressQuery,
		...ApplicantEducationQuery,
		...ApplicantPreviousEmploymentQuery,
		...ApplicantMilitaryServiceQuery,
		...ApplicantSkillQuery
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
		...ApplicantPreviousEmploymentMutation,
		...ApplicantMilitaryServiceMutation,
		...ApplicantSkillMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

const MergedSchema = mergeSchemas({
	schemas: [ IndexSchema, NativeSchema ]
});

export default MergedSchema;
