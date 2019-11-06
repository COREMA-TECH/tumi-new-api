import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { TypeTaskType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const TypeTaskQuery = {
	typeTasks: {
		type: new GraphQLList(TypeTaskType),
		description: 'List typeTask',
		args: {
			id: {type: GraphQLInt},
			code: {type: GraphQLString}
		},
		resolve(root, args) {
			return Db.models.TypeTasks.findAll({ where: args, order: [['name', 'ASC']] });
		}
	},
};

export default TypeTaskQuery;
