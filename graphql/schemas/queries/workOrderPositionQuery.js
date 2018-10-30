import { GraphQLInt, GraphQLList } from 'graphql';
import { WorkOrderPositionType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const WorkOrderPositionQuery = {
	workOrderPosition: {
		type: new GraphQLList(WorkOrderPositionType),
		description: 'List work order positions records',
		args: {
			id: {
				type: GraphQLInt
			},
			WorkOrderId: {
				type: GraphQLInt
			},
			PostionRateId: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.WorkOrderPosition.findAll({ where: args });
		}
	}
};

export default WorkOrderPositionQuery;
