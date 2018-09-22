import { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
const fields = {
	Related_Table: {
		type: new GraphQLNonNull(GraphQLString)
	},
	Id_Entity: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Electronic_Address_Type: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Electronic_Address: {
		type: new GraphQLNonNull(GraphQLString)
	},
	IsPrimary: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	IsActive: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	User_Created: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	User_Updated: {
		type: new GraphQLNonNull(GraphQLInt)
	},
	Date_Created: {
		type: new GraphQLNonNull(GraphQLString)
	},
	Date_Updated: {
		type: new GraphQLNonNull(GraphQLString)
	}
};
const inputType = new GraphQLInputObjectType({
	name: 'iParamEA',
	description: 'Input Parameter for Electronic Address Mutation',

	fields: {
		...fields
	}
});

const outputType = new GraphQLObjectType({
	name: 'ElectronicAddress',
	description: 'This is for electronic address',
	fields: {
		Id: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		...fields
	}
});

export { inputType, outputType };
