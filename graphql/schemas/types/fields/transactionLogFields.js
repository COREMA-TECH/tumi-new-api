import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean, graphql } from 'graphql';
import GraphQLDate from 'graphql-date';

const TransactionLogFields = {
	codeUser: {
		type: GraphQLInt,
		description: 'Code User'
	},
	nameUser: {
		type: GraphQLString,
		description: 'Name User'
	},
	actionDate: {
		type: GraphQLDate,
		description: 'Action Date'
	},
	action: {
		type: GraphQLString,
		description: 'Action'
	},
	affectedObject: {
		type: GraphQLString,
		description: 'Affected Objects'
	}

};

export default TransactionLogFields;
