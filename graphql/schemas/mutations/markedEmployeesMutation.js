import { inputInsertMarkedEmployees, inputTimeMark } from '../types/operations/insertTypes';
import { inputUpdateMarkedEmployees, TimeMarkUpdateType } from '../types/operations/updateTypes';
import { MarkedEmployeesType, TimeMarkType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';

import moment from 'moment';

import Db from '../../models/models';


const MarkedEmployeesMutation = {
	addMarkedEmployees: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Add Marked Employees to database',
		args: {
			MarkedEmployees: { type: new GraphQLList(inputInsertMarkedEmployees) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees.bulkCreate(args.MarkedEmployees);

		}
	},

	createMark: {
		type: TimeMarkType,
		description: "Add a signle mark (in-out)",
		args: {
			input: { type: inputTimeMark }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees.create(args.input)
			.then(created => { return created });
		}
	},

	updateMark: {
		type: TimeMarkType,
		description: 'Update Marked Employees Info',
		args: {
			markedemployees: { type: TimeMarkUpdateType }
		},
		resolve(source, args) {
			console.clear();
			console.log(args.markedemployees);

			if (args.markedemployees.markedDate === "1970-01-01") {
				return Db.models.MarkedEmployees.destroy({
					where: {
						id: args.markedemployees.id
					}
				}).then(deleted => {
					return deleted;
				})
			} else {
				return Db.models.MarkedEmployees
					.update(args.markedemployees,
						{
							where: {
								id: args.markedemployees.id
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

	},

	actualizarFormatoHoraMarcas: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Actualizar de forma masiva las marcadas',
		resolve(source, args) {
			return Db.models.MarkedEmployees.findAll({ where: { markedTime: { $like: '%M%' } } }).
				then(_ => {
					let marks = [];
					_.map(_mark => {
						let mark = _mark.dataValues;
						let hours = mark.markedTime.split(' ');
						let _hour = hours[0];
						if (hours[1] == 'PM' && parseInt(hours[0]) != 12)
							_hour = moment(_hour, "hh:mm").add(12, 'hours').format("HH:mm");
						if (_hour.length == 4) _hour = `0${_hour}`;
						marks.push({ id: mark.id, markedTime: _hour })
					})
					marks.map(_arr => {
						return Db.models.MarkedEmployees.update({ markedTime: _arr.markedTime }, { where: { id: _arr.id } })
					})

				})
		}
	},
	updateMarkedEmployees: {
		type: MarkedEmployeesType,
		description: 'Update Marked Employees Info',
		args: {
			markedemployees: { type: inputUpdateMarkedEmployees }
		},
		resolve(source, args) {
			console.clear();
			console.log(args.markedemployees);

			if (args.markedemployees.markedDate === "1970-01-01") {
				return Db.models.MarkedEmployees.destroy({
					where: {
						id: args.markedemployees.id
					}
				}).then(deleted => {
					return deleted;
				})
			} else {
				return Db.models.MarkedEmployees
					.update(args.markedemployees,
						{
							where: {
								id: args.markedemployees.id
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

	},
	approveMarks: {
		type: MarkedEmployeesType,
		description: 'Approve Marks',
		args: {
			approvedDate: { type: new GraphQLNonNull(GraphQLDate) },
			idsToApprove: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees
				.update({ approvedDate: args.approvedDate },
					{
						where: {
							id: { $in: args.idsToApprove }
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
	unapproveMarks: {
		type: MarkedEmployeesType,
		description: 'Unapprove Marks',
		args: {
			idsToUnapprove: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees
				.update({ approvedDate: null },
					{
						where: {
							id: { $in: args.idsToUnapprove }
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
	deleteMarks: {
		type: GraphQLInt,
		description: 'Approve Marks',
		args: {
			idsToDelete: { type: new GraphQLNonNull(new GraphQLList(GraphQLInt)) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees
				.destroy(
					{
						where: {
							id: { $in: args.idsToDelete }
						}
					}
				)
		}
	},
};

export default MarkedEmployeesMutation;
