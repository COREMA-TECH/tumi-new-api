import { inputInsertWorkOrder } from '../types/operations/insertTypes';
import { inputUpdateWorkOrder } from '../types/operations/updateTypes';
import { WorkOrderType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const WorkOrderMutation = {
	addWorkOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'Add Work Order to database',
		args: {
			workOrder: { type: new GraphQLList(inputInsertWorkOrder) }
		},
		resolve(source, args) {
			return Db.models.WorkOrder.bulkCreate(args.workOrder, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateWorkOrder: {
		type: WorkOrderType,
		description: 'Update Work Order Info',
		args: {
			workOrder: { type: inputUpdateWorkOrder }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						IdEntity: args.workOrder.IdEntity,
						userId: args.workOrder.userId,
						date: args.workOrder.date,
						status: args.workOrder.status,
						quantity: args.workOrder.quantity,
						shift: args.workOrder.shift,
						startDate: args.workOrder.startDate,
						endDate: args.workOrder.endDate,
						needExperience: args.workOrder.needExperience,
						needEnglish: args.workOrder.needEnglish,
						PositionRateId: args.workOrder.PositionRateId,
						comment: args.workOrder.comment
					},
					{
						where: {
							id: args.workOrder.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	deleteWorkOrder: {
		type: GraphQLInt,
		description: 'Delete workorder record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.WorkOrder.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default WorkOrderMutation;
