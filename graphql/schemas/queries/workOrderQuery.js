import { GraphQLInt, GraphQLList } from 'graphql';
import { WorkOrderType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const WorkOrderQuery = {
	workOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'List work order records',
		args: {
			id: {
				type: GraphQLInt
			},
			IdEntity: {
				type: GraphQLInt
			},
			date: {
				type: GraphQLInt
			},
			status: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.WorkOrder.findAll({ where: args });
		}
	}
};

export default WorkOrderQuery;
