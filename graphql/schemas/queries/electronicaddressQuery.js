import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { ElectronicAddressType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ElectronicAddressQuery = {
	getelectronicaddress: {
		description: 'List all the electronic addresses',
		type: new GraphQLList(ElectronicAddressType),
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
