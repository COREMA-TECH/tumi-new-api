import {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLInputObjectType
} from 'graphql';

import Db from '../models/models';

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
const iParamEA = new GraphQLInputObjectType({
	name: 'iParamEA',
	description: 'Input Parameter for Electronic Address Mutation',

	fields: {
		...fields
	}
});

const type = new GraphQLObjectType({
	name: 'ElectronicAddress',
	description: 'This is for electronic address',
	fields: {
		Id: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		...fields
	}
});

const ElectronicAddressQuery = {
	getelectronicaddress: {
		description: 'List all the electronic addresses',
		type: new GraphQLList(type),
		args: {
			Id: { type: GraphQLInt },
			IsActive: { type: GraphQLInt },
			Related_Table: { type: GraphQLString },
			Id_Entity: { type: GraphQLInt }
		},
		resolve(root, args) {
			return Db.models.ElectronicAddress.findAll({ where: args });
		}
	}
};

const ElectronicAddressMutation = {
	inselectronicaddress: {
		type: type,
		description: 'Insert an Electronic Address record',
		args: {
			iParamEA: { type: iParamEA }
		},
		resolve(source, args) {
			return Db.models.ElectronicAddress.create({
				Related_Table: args.iParamEA.Related_Table,
				Id_Entity: args.iParamEA.Id_Entity,
				Electronic_Address_Type: args.iParamEA.Electronic_Address_Type,
				Electronic_Address: args.iParamEA.Electronic_Address,
				IsPrimary: args.iParamEA.IsPrimary,
				IsActive: args.iParamEA.IsActive,
				User_Created: args.iParamEA.User_Created,
				User_Updated: args.iParamEA.User_Updated,
				Date_Created: args.iParamEA.Date_Created,
				Date_Updated: args.iParamEA.Date_Updated
			});
		}
	}
};

export { ElectronicAddressQuery, ElectronicAddressMutation };
