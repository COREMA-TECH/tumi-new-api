import { inputInsertShiftDetail, inputInsertShift, inputParamWorkOrderForShift } from '../types/operations/insertTypes';
import { inputUpdateShiftDetail } from '../types/operations/updateTypes';
import { ShiftDetailType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';
import { sendgenericemail } from '../../../Configuration/Roots';

import Db from '../../models/models';

const shiftDetailMutation = {
	addShiftDetail: {
		type: new GraphQLList(ShiftDetailType),
		description: 'Add Shift to database',
		args: {
			ShiftDetail: { type: new GraphQLList(inputInsertShiftDetail) }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.bulkCreate(args.ShiftDetail, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateShiftDetail: {
		type: ShiftDetailType,
		description: 'Update Shift Info',
		args: {
			ShiftDetail: { type: inputUpdateShiftDetail }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail
				.update(
					{
						startDate: args.ShiftDetail.startDate,
						endDate: args.ShiftDetail.endDate,
						startTime: args.ShiftDetail.startTime,
						endTime: args.ShiftDetail.endTime,
						ShiftId: args.ShiftDetail.ShiftId
					},
					{
						where: {
							id: args.ShiftDetail.id
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
	deleteShiftDetail: {
		type: GraphQLInt,
		description: 'Delete Shift Details record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},

	deleteShiftDetailbyShift: {
		type: GraphQLInt,
		description: 'Delete Shift Details record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.destroy({ where: { ShiftId: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},
	deleteShiftDetailbyShift: {
		type: GraphQLInt,
		description: 'Delete Shift Details record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.destroy({ where: { ShiftId: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},

	createShiftDetail: {
		type: new GraphQLList(ShiftDetailType),
		description: 'Insert Header and Detail for Shifts',
		args: {
			startHour: { type: new GraphQLNonNull(GraphQLString) },
			endHour: { type: new GraphQLNonNull(GraphQLString) },
			shift: { type: new GraphQLNonNull(inputInsertShift) },
			employees: { type: new GraphQLList(GraphQLInt) },
			special: { type: new GraphQLNonNull(inputParamWorkOrderForShift) }
		},
		resolve(source, args) {
			return Db.transaction((t) => {
				let shiftList = [], employeeIndex = -1, datesList = [];

				shiftList = args.employees.map(employee => { return args.shift })

				//Create dates to be inserted in ShiftDetail
				var currentDate = new Date(args.shift.startDate); //Variables used to save the current date inside the while
				//Replace daysWeek string with days numbers, starting Monday with 1 and finishing Sunday with 0
				var weekDays = args.shift.dayWeek.replace("MO", 0).replace("TU", 1).replace("WE", 2).replace("TH", 3).replace("FR", 4).replace("SA", 5).replace("SU", 6)
				//Get every day between startDate and endDate to generate ShiftDetail records
				while (currentDate <= args.shift.endDate) {
					let newDate = new Date(currentDate)
					if (weekDays.includes(newDate.getDay())) {
						datesList.push({
							startDate: newDate,
							endDate: newDate,
							startTime: args.startHour,
							endTime: args.endHour
						});
					}
					currentDate.setDate(currentDate.getDate() + 1)
				}
				//Crate WorkOrder object based on parameters
				var workOrder = {
					IdEntity: args.shift.entityId,
					userId: args.special.userId,
					date: args.shift.startDate,
					status: args.special.status,
					quantity: args.employees.length,
					shift: args.startHour,
					startDate: args.shift.startDate,
					endDate: args.shift.endDate,
					needExperience: args.special.needExperience,
					needEnglish: args.special.needEnglish,
					comment: args.special.comment,
					PositionRateId: args.shift.idPosition,
					contactId: args.special.requestedBy,
					EspecialComment: args.special.specialComment,
					endShift: args.endHour,
					dayWeek: args.shift.dayWeek
				}
				//Create WorkOrder
				return Db.models.WorkOrder.create(workOrder, { returning: true, transaction: t }).then((wo) => {
					//Insert a List of Shift, one shift for every selected employee
					return Db.models.Shift.bulkCreate(shiftList, { returning: true, transaction: t }).then((ret) => {
						var shiftDetail = []//List of dates
						var shiftWorkOrder = [];
						//Create list of ShiftDetail based on Shifts Created
						ret.map(item => {
							//Create list of ShiftDetail based on array of dates
							datesList.map(date => {
								shiftDetail.push({ startDate: date.startDate, endDate: date.endDate, startTime: date.startTime, endTime: date.endTime, ShiftId: item.id });
							})
							//Create array to insert inside ShiftWorkOrder table
							shiftWorkOrder.push({ ShiftId: item.id, WorkOrderId: wo.dataValues.id })
						})
						//Insert Into ShiftWorkOrderTable
						return Db.models.ShiftWorkOrder.bulkCreate(shiftWorkOrder, { returning: true, transaction: t }).then(swo => {
							//Insert ShiftDetail records into database
							//ShiftDetail records are created based on Shift and Working Days
							return Db.models.ShiftDetail.bulkCreate(shiftDetail, { returning: true, transaction: t }).then((data) => {
								let newEmployees = [], shiftDetailId = 0;
								data.map(item => {
									//Increment Employee position only when ShiftId is differente from previous
									if (shiftDetailId != item.dataValues.ShiftId) {
										employeeIndex += 1;//Increment position in the employee list
										shiftDetailId = item.dataValues.ShiftId;
									}
									newEmployees.push({ ShiftDetailId: item.id, EmployeeId: args.employees[employeeIndex] })
								})
								return Db.models.ShiftDetailEmployees.bulkCreate(newEmployees, { returning: true, transaction: t }).then(ret => {
									//Db.models.Employees.findAll({ where: { id: ret[0].dataValues.EmployeeId } }).then((select) => {
									//	select.map((datashiftEmployee) => {
									//	sendgenericemail({ StartDate: args.startDate.toISOString().substring(0, 10), ToDate: args.endDate.toISOString().substring(0, 10), ShiftStart: args.startHour, ShiftEnd: args.endHour, shift: Shiftid, email: datashiftEmployee.dataValues.electronicAddress, title: args.shift.title })
									//	});
									//});

									return ret.dataValues;
								})
							});
						})
					});
				})

			})
		}
	}
};

export default shiftDetailMutation;