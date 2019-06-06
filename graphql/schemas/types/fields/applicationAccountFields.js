import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean, GraphQLFloat } from 'graphql';

const ApplicationAccountFields = {
	applicationId: {
		type: GraphQLInt,
		description: 'Employee'
	},
	firstName: {
		type: GraphQLString,
		description: 'Name of the Employee'
    },
    lastName: {
		type: GraphQLString,
		description: 'Last name of the Employee'
	},
	city: {
		type: GraphQLInt,
		description: 'City'
    },
    state: {
		type: GraphQLInt,
		description: 'State'
    },
    zipcode: {
		type: GraphQLInt,
		description: 'Zipcode'
    },
    bankName: {
		type: GraphQLString,
		description: 'Bank Name'
    },
    accountNumber: {
		type: GraphQLInt,
		description: 'Account Number'
    },
    routingNumber: {
		type: GraphQLInt,
		description: 'Routing Number'
	},
	accountType: {
		type: GraphQLString,
		description: 'Type of Account'
	},
	amount: {
		type: GraphQLFloat,
		description: 'Amount'
	},
	amountType: {
		type: GraphQLString,
		description: 'Amount Type'
	},
	address: {
		type: GraphQLString,
		description: "address"
	}
};

export default ApplicationAccountFields;
