import { inputInsertShiftDetail, inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateShiftDetail } from '../types/operations/updateTypes';
import { ShiftDetailType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';

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
			startDate: { type: new GraphQLNonNull(GraphQLDate) },
			endDate: { type: new GraphQLNonNull(GraphQLDate) },
			startHour: { type: new GraphQLNonNull(GraphQLString) },
			endHour: { type: new GraphQLNonNull(GraphQLString) },
			shift: { type: inputInsertShift },
			employees: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.transaction((t) => {
				let shiftList = [], employeeIndex = -1;
				let Shiftid = 0;

				shiftList = args.employees.map(employee => { return args.shift })
				return Db.models.Shift.bulkCreate(shiftList, { returning: true, transaction: t }).then((ret) => {
					var dates = []//List of dates
					//Create object to insert into ShiftDetail table	
					Shiftid = item.id
					ret.map(item => {
						dates.push({ startDate: args.startDate, endDate: args.endDate, startTime: args.startHour, endTime: args.endHour, ShiftId: item.id });
					})
					//Insert ShiftDetail records into database
					return Db.models.ShiftDetail.bulkCreate(dates, { returning: true, transaction: t }).then((data) => {
						let newEmployees = [];
						data.map(item => {
							employeeIndex += 1;
							newEmployees.push({ ShiftDetailId: item.id, EmployeeId: args.employees[employeeIndex] })
						})
						return Db.models.ShiftDetailEmployees.bulkCreate(newEmployees, { returning: true, transaction: t }).then(ret => {

							Db.models.Employees.findAll({ where: { id: ret.dataValues.EmployeeId } }).then((select) => {
								select.map((datashiftEmployee) => {
									sendgenericemail({ StartDate: args.startDate.toISOString().substring(0, 10), ToDate: args.endDate.toISOString().substring(0, 10), ShiftStart: args.startHour, ShiftEnd: args.endHour, shift: Shiftid, email: datashiftEmployee.dataValues.electronicAddress, title: args.shift.title })
								});
							});

							return ret.dataValues;
						})
					});


				});
			})
		}
	}
};

export default shiftDetailMutation;