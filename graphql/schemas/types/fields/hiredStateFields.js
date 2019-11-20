import { GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
const formFields = {
	name: {
		type: GraphQLString
	},
	description: {
		type: GraphQLString
	},
	order: {
		type: GraphQLInt
    },
    userCreated: {
        type: GraphQLInt
    },
    userUpdated: {
        type: GraphQLInt
    },
    isActive: {
        type: GraphQLBoolean
    }
};
export default formFields;
