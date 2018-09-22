import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { outputType } from './electronicaddressType';
import Db from '../../models/models';

const ElectronicAddressQuery = {
	getelectronicaddress: {
		description: 'List all the electronic addresses',
		type: new GraphQLList(outputType),
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

export default ElectronicAddressQuery;
