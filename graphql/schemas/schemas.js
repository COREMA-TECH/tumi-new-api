import { GraphQLSchema, GraphQLObjectType } from 'graphql';

import { ApplicationQuery, ApplicationMutation } from './application/';

import { ElectronicAddressMutation, ElectronicAddressQuery } from './electronicaddress';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ElectronicAddressQuery
	}
});
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: {
		...ApplicationMutation,
		...ElectronicAddressMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

export default IndexSchema;
