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
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {

			let shifts = [], phasesData = [], dates = [], ShiftWorkOrder = [];

			return Db.models.WorkOrder.bulkCreate(args.workOrder, { returning: true }).then((ret) => {
				ret.map((data) => {

					let workOrdersPhase = {}, currentQ = 0, shiftData, ShiftWorkOrderData;
					let weekDays = data.dataValues.dayWeek.replace("MO", 1).replace("TU", 2).replace("WE", 3).replace("TH", 4).replace("FR", 5).replace("SA", 6).replace("SU", 0);

					workOrdersPhase = {
						userId: data.dataValues.userId,
						phaseworkOrderId: 30453,
						WorkOrderId: data.dataValues.id
					}

					phasesData.push(workOrdersPhase);

					while (currentQ < data.dataValues.quantity) {
						shiftData = {
							entityId: data.dataValues.IdEntity,
							title: data.dataValues.id,
							color: '#96989A',
							status: 1,
							idPosition: data.dataValues.PositionRateId,
							startDate: data.dataValues.startDate,
							endDate: data.dataValues.endDate,
							needExperience: data.dataValues.needExperience,
							needEnglish: data.dataValues.needEnglish,
							comment: data.dataValues.comment,
							contactId: data.dataValues.contactId,
							EspecialComment: "",
							endshift: data.dataValues.endShift,
							departmentId: data.dataValues.departmentId,
							dayWeek: data.dataValues.dayWeek
						}
						shifts.push(shiftData);
						currentQ = currentQ + 1;
					}

					return Db.models.Shift.bulkCreate(shifts, { returning: true }).then((shiftsSaved) => {
						shiftsSaved.map((shift) => {
							let currentDate = new Date(shift.dataValues.startDate);
							while (currentDate <= data.dataValues.endDate) {
								let newDate = new Date(currentDate);

								if (weekDays.includes(newDate.getDay())) {
									dates.push({
										startDate: newDate,
										endDate: newDate,
										startTime: data.dataValues.shift,
										endTime: data.dataValues.endShift,
										color: '#96989A',
										status: 0,
										ShiftId: shift.dataValues.id
									});
								}

								currentDate.setDate(currentDate.getDate() + 1)
							}
							ShiftWorkOrderData = {
								ShiftId: shift.dataValues.id,
								WorkOrderId: data.dataValues.id
							}
							ShiftWorkOrder.push(ShiftWorkOrderData);
						});
					});

				});
			}).then(() => {
				
				return Db.models.PhaseWorkOrder.bulkCreate(phasesData).then(() => {
					return Db.models.ShiftWorkOrder.bulkCreate(ShiftWorkOrder).then(() => {
						return Db.models.ShiftDetail.bulkCreate(dates).then(() => {

							var userdate = new Date();
							var timezone = userdate.getTimezoneOffset();
							var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						
							return Db.models.TransactionLogs.create({
								codeUser: args.codeuser,
								nameUser: args.nameUser,
								actionDate: serverdate,
								action: 'CREATED ROW',
								affectedObject: 'WORK ORDER'
							});
						});
					}).catch(error => {
						console.log(error)
					});
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
			quantity: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.WorkOrder
				.update(
					args.workOrder,
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

						return Db.models.ShiftWorkOrder.findAll({ where: { WorkOrderId: args.workOrder.id } }).then((select) => {
							return select.map((datashiftworkOrder) => {
								Db.models.Shift.destroy({ where: { id: datashiftworkOrder.dataValues.ShiftId } }).then((deleted) => {
								});
							});
						}).then(() => {
							while (currentQ <= args.quantity) {

								currentQ = currentQ + 1;

								return Db.models.Shift.bulkCreate(args.shift, { returning: true }).then((ret) => {
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
										return Db.models.ShiftDetail.bulkCreate(dates, { returning: true }).then((ret) => { })
											.then(() => {
												//Insert Shift - WorkOrder records into database
												return Db.models.ShiftWorkOrder.create({ ShiftId: datashift.dataValues.id, WorkOrderId: args.workOrder.id }).then(() => {
													return record.dataValues;
												})
											})
									});
								});
							}

							
							var userdate = new Date();
							var timezone = userdate.getTimezoneOffset();
							var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
							
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'WORK ORDER'
							});
							return record.dataValues;
						})

					}
					else { return null; }
				});
		}
	},
	deleteWorkOrder: {
		type: GraphQLInt,
		description: 'Delete workorder record from database',
		args: {
			id: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
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
					if (record){

						
						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'DELETED ROW',
							affectedObject: 'WORK ORDER'
							});

						return 1;	
					}
					else return null;
				});
		}
	},
	deleteShiftDetailEmployees: {
		type: EmployeesType,
		description: 'Delete employees record from database',
		args: {
			id: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.ShiftDetailEmployees.destroy({ where: { EmployeeId: args.id } }).then((deleted) => {
				
				var userdate = new Date();
				var timezone = userdate.getTimezoneOffset();
				var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
				
			Db.models.TransactionLogs.create({
				codeUser: args.codeuser,
				nameUser: args.nameUser,
				actionDate: serverdate,
				action: 'DELETED ROW',
				affectedObject: 'SHIFT DETAIL EMPLOYEES'
				});
				
				return deleted;
			});
		}
	},
	convertToOpening: {
		type: WorkOrderType,
		description: 'Convert WorkOrder to Opening',
		args: {
			id: { type: GraphQLInt },
			userId: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
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

					if (record) {
						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'WORK ORDER'
							});

							return record.dataValues;

					}
					else return null;
				});
		}
	},
	rejectWorkOrder: {
		type: WorkOrderType,
		description: 'Reject Work Order',
		args: {
			id: { type: GraphQLInt },
			userId: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
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

					if (record){
						
						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'WORK ORDER'
							});


						return record.dataValues;

					} 
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
					if (record) {
						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'WORK ORDER'
							});

					return record.dataValues;
				}
					else return null;
				});
		}
	}
};

export default WorkOrderMutation;
