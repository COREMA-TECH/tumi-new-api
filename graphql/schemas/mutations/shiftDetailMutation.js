import { inputInsertShiftDetail, inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateShiftDetail } from '../types/operations/updateTypes';
import { ShiftDetailType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
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
				shiftList = args.employees.map(employee => { return args.shift })
				return Db.models.Shift.bulkCreate(shiftList, { returning: true, transaction: t }).then((ret) => {

					var currentDate = new Date(args.startDate); //Variables used to save the current date inside the while
					var endDate = new Date(args.endDate); //Variables used to save the current date inside the while


					var dates = []//List of dates
					//Create object to insert into ShiftDetail table			
					employeeIndex += 1;
					ret.map(item => {
						dates.push({ startDate: args.startDate, endDate: args.endDate, startTime: args.startHour, endTime: args.endHour, ShiftId: item.id });
						sendgenericemail({ StartDate: currentDate.toISOString().substring(0, 10), ToDate: endDate.toISOString().substring(0, 10), ShiftStart: args.startHour, ShiftEnd: args.endHour, shift: item.id, email: "mppomar@gmail.com", title: args.shift[0].title })

					})
					//Insert ShiftDetail records into database
					return Db.models.ShiftDetail.bulkCreate(dates, { returning: true, transaction: t }).then((data) => {
						let newEmployees = [];
						data.map(item => {
							newEmployees.push({ ShiftDetailId: item.id, EmployeeId: args.employees[employeeIndex] })
						})
						return Db.models.ShiftDetailEmployees.bulkCreate(newEmployees, { returning: true, transaction: t }).then(ret => {
							return ret.dataValues;
						})
					});


				});
			})



		}
	}
};

export default shiftDetailMutation;
