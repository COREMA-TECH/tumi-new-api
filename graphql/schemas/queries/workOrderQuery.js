import { GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';
import { WorkOrderType, WorkOrderGridType } from '../types/operations/outputTypes';
import { inputInsertWorkOrderCompany, inputQueryWorkOrder } from '../types/operations/insertTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';
import moment from 'moment';
import GraphQLDate from 'graphql-date';

const Op = Sequelize.Op;

/*const inputQueryWorkOrder = new GraphQLInputObjectType({
	name: 'inputQueryWorkOrder',
	description: 'Inputs for Work Order Insert',

	fields: {
		id: { type: GraphQLInt },
		startDate: { type: GraphQLDate },
		endDate: { type: GraphQLDate },
		status: { type: GraphQLInt }
	}
});*/

const WorkOrderQuery = {
	workOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'List work order records',
		args: {
			workOrder: { type: inputQueryWorkOrder },
			workOrderCompany: { type: inputInsertWorkOrderCompany }
		},
		resolve(root, args) {

			return Db.models.WorkOrder.findAll({
				where: args.workOrder,
				include: [{
					model: Db.models.BusinessCompany,
					as: 'BusinessCompanyWO',
					where: args.workOrderCompany
				}]
			});
		}
	},
	workOrderForScheduleView: {
		type: new GraphQLList(WorkOrderGridType),
		description: 'List work order records',
		args: {
			IdEntity: { type: new GraphQLNonNull(GraphQLInt) },
			departmentId: { type: new GraphQLNonNull(GraphQLInt) },
			startDate: { type: new GraphQLNonNull(GraphQLDate) },
			endDate: { type: new GraphQLNonNull(GraphQLDate) }
		},
		resolve(root, args) {
			let { startDate, endDate, ...filter } = args;

			filter = {
				...filter, groupKey: { $not: null },
				$and: [
					{ startDate: { $gte: new Date(startDate.setUTCHours(0, 0, 0)) } },
					{ startDate: { $lte: new Date(endDate.setUTCHours(23, 59, 59)) } }]
			};

			return Db.models.WorkOrder.findAll({
				where: filter,
				order: [
					['groupKey', 'ASC'],
					['startDate', 'ASC']
				],
				include: [
					{
						model: Db.models.ShiftWorkOrder,
						required: true,
						include: [{
							model: Db.models.Shift,
							required: true,
							as: 'Shift',
							include: [{
								model: Db.models.ShiftDetail,
								required: true,
								include: [{
									model: Db.models.ShiftDetailEmployees,
									required: true
								}]
							}]
						}]
					}
				]
			})
				.then(workOrders => {

					let employeeIds = [];
					let data = [];
					workOrders.forEach(_woObject => {
						let workOrder = _woObject.dataValues;

						workOrder.ShiftWorkOrders.forEach(_shiftWorkOrderObject => {
							let shiftWorkOrder = _shiftWorkOrderObject.dataValues;
							let shift = shiftWorkOrder.Shift.dataValues;
							shift.ShiftDetails.forEach(_shiftDetailObject => {
								let shiftDetail = _shiftDetailObject.dataValues;
								let shiftDetailEmployee = shiftDetail.ShiftDetailEmployee.dataValues;
								let employeeId = shiftDetailEmployee.Employee;

								if (!employeeIds.find(id => id === employeeId))
									employeeIds.push(employeeId);
								let dataFound = data.find(_record => _record.groupKey === workOrder.groupKey && _record.employeeId === employeeId);
								if (!dataFound)
									data.push({ groupKey: workOrder.groupKey, employeeId, dates: [{ code: moment.utc(workOrder.startDate).format("MM/DD/YYYY"), value: workOrder.shift }], departmentId: workOrder.departmentId, IdEntity: workOrder.IdEntity });
								else dataFound.dates.push({ code: moment.utc(workOrder.startDate).format("MM/DD/YYYY"), value: workOrder.shift });
							})
						})
					})
					return data;
				})
		}
	}
};

export default WorkOrderQuery;
