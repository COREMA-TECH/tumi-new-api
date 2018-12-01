import { inputInsertWorkOrder, inputInsertPhaseWorkOrder } from '../types/operations/insertTypes';
import { inputUpdateWorkOrder } from '../types/operations/updateTypes';
import { WorkOrderType, PhaseWorkOrderType } from '../types/operations/outputTypes';
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
					//	console.log("Valor del id ", data.dataValues.id);
					Db.models.PhaseWorkOrder.create({
						userId: 10,//data.dataValues.userId,
						phaseworkOrderId: 30453,
						WorkOrderId: data.dataValues.id
					});

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
						contactId: args.workOrder.contactId,
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
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	/*deleteWorkOrder: {
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
	},*/
	deleteWorkOrder: {
		type: GraphQLInt,
		description: 'Delete workorder record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt },
			userId: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						status: 3
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					Db.models.PhaseWorkOrder.create({
						userId: 10,//args.userId,
						phaseworkOrderId: 30457,
						WorkOrderId: args.id
					});

					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	convertToOpening: {
		type: WorkOrderType,
		description: 'Convert WorkOrder to Opening',
		args: {
			id: { type: GraphQLInt },
			userId: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						status: 2
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					Db.models.PhaseWorkOrder.create({
						userId: 10,//args.userId,
						phaseworkOrderId: 30454,
						WorkOrderId: args.id
					});

					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	rejectWorkOrder: {
		type: WorkOrderType,
		description: 'Reject Work Order',
		args: {
			id: { type: GraphQLInt },
			userId: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						status: 1
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					Db.models.PhaseWorkOrder.create({
						userId: 10,//args.userId,
						phaseworkOrderId: 30455,
						WorkOrderId: args.id
					});

					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default WorkOrderMutation;
