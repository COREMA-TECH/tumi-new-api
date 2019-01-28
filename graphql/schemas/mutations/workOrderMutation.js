import { inputInsertWorkOrder, inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateWorkOrder } from '../types/operations/updateTypes';
import { WorkOrderType, PhaseWorkOrderType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';
import { sendgenericemail } from '../../../Configuration/Roots';
import Db from '../../models/models';
import { EmployeesType } from '../types/operations/outputTypes';

const WorkOrderMutation = {
	addWorkOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'Add Work Order to database',
		args: {
			workOrder: { type: new GraphQLList(inputInsertWorkOrder) },
			shift: { type: new GraphQLList(inputInsertShift) },
			startDate: { type: new GraphQLNonNull(GraphQLDate) },
			endDate: { type: new GraphQLNonNull(GraphQLDate) },
			startshift: { type: new GraphQLNonNull(GraphQLString) },
			endshift: { type: new GraphQLNonNull(GraphQLString) },
			quantity: { type: new GraphQLNonNull(GraphQLInt) },
			Electronic_Address: { type: new GraphQLNonNull(GraphQLString) }
		},
		resolve(source, args) {

			return Db.models.WorkOrder.bulkCreate(args.workOrder, { returning: true }).then((ret) => {
				return ret.map((data) => {

					Db.models.PhaseWorkOrder.create({
						userId: args.workOrder[0].userId,
						phaseworkOrderId: 30453,
						WorkOrderId: data.dataValues.id
					});

					var currentQ = 1;

					while (currentQ <= args.quantity) {

						currentQ = currentQ + 1;

						//Db.models.WorkOrderPosition.create({ userId: args.workOrder[0].userId, status: args.workOrder[0].status, quantity: 1, PositionRateId: args.workOrder[0].PositionRateId, WorkOrderId: data.dataValues.id });

						Db.models.Shift.bulkCreate(args.shift, { returning: true }).then((ret) => {
							return ret.map((datashift) => {


								var dates = []//List of dates
								var currentDate = new Date(args.startDate); //Variables used to save the current date inside the while
								var endDate = new Date(args.endDate); //Variables used to save the current date inside the while


								//	sendgenericemail({ StartDate: currentDate.toISOString().substring(0, 10), ToDate: endDate.toISOString().substring(0, 10), ShiftStart: args.startshift, ShiftEnd: args.endshift, shift: datashift.dataValues.id, email: args.Electronic_Address, title: args.shift[0].title })


								//Get every day between startDate and endDate to generate ShiftDetail records
								while (currentDate <= endDate) {
									let newDate = new Date(currentDate)
									if (args.shift[0].dayWeek.indexOf('MO') != -1 && newDate.getUTCDay() == 1) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('TU') != -1 && newDate.getUTCDay() == 2) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('WE') != -1 && newDate.getUTCDay() == 3) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('TH') != -1 && newDate.getUTCDay() == 4) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('FR') != -1 && newDate.getUTCDay() == 5) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('SA') != -1 && newDate.getUTCDay() == 6) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
									if (args.shift[0].dayWeek.indexOf('SU') != -1 && newDate.getUTCDay() == 0) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }

									currentDate.setDate(currentDate.getDate() + 1)
								}

								//Insert ShiftDetail records into database
								Db.models.ShiftDetail.bulkCreate(dates, { returning: true }).then((ret) => { });
								//Insert Shift - WorkOrder records into database
								Db.models.ShiftWorkOrder.create({ ShiftId: datashift.dataValues.id, WorkOrderId: data.dataValues.id });
							});
						});
					}

					return data.dataValues;
				});
			});
		}
	},
	updateWorkOrder: {
		type: WorkOrderType,
		description: 'Update Work Order Info',
		args: {
			workOrder: { type: inputUpdateWorkOrder },
			shift: { type: new GraphQLList(inputInsertShift) },
			startDate: { type: GraphQLDate },
			endDate: { type: GraphQLDate },
			startshift: { type: GraphQLString },
			endshift: { type: GraphQLString },
			quantity: { type: GraphQLInt }
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
						endShift: args.workOrder.endShift,
						startDate: args.workOrder.startDate,
						endDate: args.workOrder.endDate,
						needExperience: args.workOrder.needExperience,
						needEnglish: args.workOrder.needEnglish,
						PositionRateId: args.workOrder.PositionRateId,
						comment: args.workOrder.comment,
						EspecialComment: args.workOrder.EspecialComment,
						dayWeek: args.workOrder.dayWeek,
						quantityFilled: 0
					},
					{
						where: {
							id: args.workOrder.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) {
						var currentQ = 1;

						Db.models.ShiftWorkOrder.findAll({ where: { WorkOrderId: args.workOrder.id } }).then((select) => {
							select.map((datashiftworkOrder) => {
								Db.models.Shift.destroy({ where: { id: datashiftworkOrder.dataValues.ShiftId } }).then((deleted) => {
								});
							});
						});

						while (currentQ <= args.quantity) {

							currentQ = currentQ + 1;

							Db.models.Shift.bulkCreate(args.shift, { returning: true }).then((ret) => {
								return ret.map((datashift) => {


									var dates = []//List of dates
									var currentDate = new Date(args.startDate); //Variables used to save the current date inside the while
									var endDate = new Date(args.endDate); //Variables used to save the current date inside the while


									//	sendgenericemail({ StartDate: currentDate.toISOString().substring(0, 10), ToDate: endDate.toISOString().substring(0, 10), ShiftStart: args.startshift, ShiftEnd: args.endshift, shift: datashift.dataValues.id, email: args.Electronic_Address, title: args.shift[0].title })


									//Get every day between startDate and endDate to generate ShiftDetail records
									while (currentDate <= endDate) {
										let newDate = new Date(currentDate)
										if (args.shift[0].dayWeek.indexOf('MO') != -1 && newDate.getUTCDay() == 1) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('TU') != -1 && newDate.getUTCDay() == 2) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('WE') != -1 && newDate.getUTCDay() == 3) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('TH') != -1 && newDate.getUTCDay() == 4) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('FR') != -1 && newDate.getUTCDay() == 5) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('SA') != -1 && newDate.getUTCDay() == 6) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }
										if (args.shift[0].dayWeek.indexOf('SU') != -1 && newDate.getUTCDay() == 0) { dates.push({ startDate: newDate, endDate: newDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id, color: args.shift[0].color, status: args.shift[0].status }); }

										currentDate.setDate(currentDate.getDate() + 1)
									}

									/*ret.map(item => {
										dates.push({ startDate: args.startDate, endDate: args.endDate, startTime: args.startshift, endTime: args.endshift, ShiftId: datashift.dataValues.id });
										//	sendgenericemail({ StartDate: currentDate.toISOString().substring(0, 10), ToDate: endDate.toISOString().substring(0, 10), ShiftStart: args.startHour, ShiftEnd: args.endHour, shift: item.id, email: "mppomar@gmail.com", title: args.shift.title })
	
									})*/

									//Insert ShiftDetail records into database
									Db.models.ShiftDetail.bulkCreate(dates, { returning: true }).then((ret) => { });
									//Insert Shift - WorkOrder records into database
									Db.models.ShiftWorkOrder.create({ ShiftId: datashift.dataValues.id, WorkOrderId: args.workOrder.id });



								});
							});
						}

						return record.dataValues;
					}
					else { return null; }
				});
		}
	},
	deleteWorkOrder: {
		type: GraphQLInt,
		description: 'Delete workorder record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						status: 0
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					/*	Db.models.PhaseWorkOrder.create({
							userId: 10,//args.userId,
							phaseworkOrderId: 30454,
							WorkOrderId: args.id
						});*/

					if (record) return 1;
					else return null;
				});
		}
		/*resolve(source, args) {
			return Db.models.WorkOrder.destroy({ where: { id: args.id } }).then((deleted) => {

				Db.models.ShiftWorkOrder.findAll({ where: { WorkOrderId: args.id } }).then((select) => {
					select.map((datashiftworkOrder) => {
						Db.models.Shift.destroy({ where: { id: datashiftworkOrder.dataValues.ShiftId } }).then((deleted) => {
						});
					});
				});

				return deleted;
			});
		}*/
	},
	deleteShiftDetailEmployees: {
		type: EmployeesType,
		description: 'Delete employees record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ShiftDetailEmployees.destroy({ where: { EmployeeId: args.id } }).then((deleted) => {
				return deleted;
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
	},
	updateCommentWorkOrder: {
		type: WorkOrderType,
		description: 'Reject Work Order',
		args: {
			id: { type: GraphQLInt },
			comment: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					{
						comment: args.comment
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default WorkOrderMutation;
