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
				return Db.models.Shift.create(args.shift, { transaction: t }).then((ret) => {
					var dates = []//List of dates
					var currentDate = new Date(args.startDate); //Variables used to save the current date inside the while
					//Get every day between startDate and endDate to generate ShiftDetail records
					while (currentDate <= args.endDate) {
						let newDate = new Date(currentDate)
						dates.push({
							startDate: newDate,
							endDate: newDate,
							startTime: args.startHour,
							endTime: args.endHour,
							ShiftId: ret.dataValues.id
						});
						currentDate.setDate(currentDate.getDate() + 1)
					}

					//Insert ShiftDetail records into database
					return Db.models.ShiftDetail.bulkCreate(dates, { returning: true, transaction: t }).then((ret) => {
						let newEmployees = [];
						ret.map((data) => {
							newEmployees = newEmployees.concat(args.employees.map(item => {
								return { ShiftDetailId: data.id, EmployeeId: item }
							}))
						});
						console.log("This is NewEmployees object", newEmployees)
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