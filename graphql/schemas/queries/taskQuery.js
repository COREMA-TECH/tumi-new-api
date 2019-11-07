import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { TaskType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const TaskQuery = {
	tasks: {
		type: new GraphQLList(TaskType),
		description: 'List Tasks',
		args: {
            id: {type: GraphQLInt},
            userId: {type: GraphQLInt}
		},
		resolve(root, args) {
			return Db.models.Tasks.findAll({ where: args, order: [['date', 'DESC']] });
		}
	},
};

export default TaskQuery;
