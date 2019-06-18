import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { transactionLogsTypes } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';


const TransactionLogQuery = {
	transactionLogs: {
		type: new GraphQLList(transactionLogsTypes),
		description: 'List Logs records',
		args: {
			id: {type: GraphQLInt},
			nameUser: {type: GraphQLString},
			actionDate: {type: GraphQLDate},
			action: {type: GraphQLString},
			affectedObject: {type: GraphQLString}
		},
		resolve(root, args) {
			return Db.models.TransactionLogs.findAll({ where: args
			,
			order: [
				['id', 'DESC']
			  ]
			});
		}
	},
};

export default TransactionLogQuery;
