import { inputInsertWorkOrderPosition } from '../types/operations/insertTypes';
import { inputUpdateWorkOrderPosition } from '../types/operations/updateTypes';
import { WorkOrderPositionType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const WorkOrderPositionMutation = {
	addWorkOrderPosition: {
		type: new GraphQLList(WorkOrderPositionType),
		description: 'Add Work Order Position to database',
		args: {
			workOrderPosition: { type: new GraphQLList(inputInsertWorkOrderPosition) }
		},
		resolve(source, args) {
			return Db.models.WorkOrderPostion.bulkCreate(args.workOrderPosition, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateWorkOrderPosition: {
		type: WorkOrderPositionType,
		description: 'Update Work Order Position Info',
		args: {
			workOrderPosition: { type: inputUpdateWorkOrderPosition }
		},
		resolve(source, args) {
			return Db.models.WorkOrderPostion
				.update(
					{
						userId: args.workOrderPosition.userId,
						status: args.workOrderPosition.status,
						quantity: args.workOrderPosition.quantity,
						WorkOrderId: args.workOrderPosition.WorkOrderId,
						PositionRateId: args.workOrderPosition.PositionRateId
					},
					{
						where: {
							id: args.workOrderPosition.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default WorkOrderPositionMutation;
