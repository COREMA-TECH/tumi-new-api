import { inputInsertMarkedEmployees } from '../types/operations/insertTypes';
import { inputUpdateMarkedEmployees } from '../types/operations/updateTypes';
import { MarkedEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

import moment from 'moment';

import Db from '../../models/models';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;
const CLOCKIN = 30570;
const CLOCKOUT = 30571;
const BREAKIN = 30572;
const BREAKOUT = 30573;

export const closePunches = async () => {
	let closeMark = {
		outboundMarkTypeId: CLOCKOUT,
		outboundMarkTime: '24:00'
	}
	await Db.models.MarkedEmployees_tests.update(closeMark, {where: {outboundMarkTypeId: null}});
}

const MarkedEmployeesMutation = {
	addMarkedEmployees: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Add Marked Employees to database',
		args: {
			MarkedEmployees: { type: new GraphQLList(inputInsertMarkedEmployees) }
		},
		resolve(source, args) {
			let marks = args.MarkedEmployees || [];
			let data = marks.sort((a, b) => a.entityId - b.entityId)
				.sort((a, b) => a.EmployeeId - b.EmployeeId)
				.sort((a, b) => a.markedDate - b.markedDate)
				.sort((a, b) => a.markedTime.localeCompare(b.markedTime));

			return new Promise((resolve, reject) => {
				const processData = async (i = 0) => {
					let mark = data[i];

					await Db.models.MarkedEmployees.findOne(
						{
							where: {
								$or: [{ outboundMarkTypeId: null }, { outboundMarkTime: '24:00' }],
								entityId: mark.entityId,
								EmployeeId: mark.EmployeeId,
								markedDate: mark.markedDate
							},
						})
						.then(async dbMark => {
							if (dbMark)
								await Db.models.MarkedEmployees.update({
									outboundMarkTypeId: mark.typeMarkedId,
									outboundMarkTime: mark.markedTime,
									outboundMarkImage: mark.imageMarked
								}, {
									where: { id: dbMark.id },
								})
							else {
								let lastMark = await Db.models.MarkedEmployees.findOne(
									{
										where: {
											entityId: mark.entityId,
											EmployeeId: mark.EmployeeId,
											markedDate: mark.markedDate
										},
										order: [['outboundMarkTime', 'DESC']]
									})
								let newMarkedEmployee = {};
								if (lastMark && lastMark.outboundMarkTypeId != CLOCKOUT)
									newMarkedEmployee = {
										inboundMarkTypeId: lastMark.outboundMarkTypeId,
										inboundMarkTime: lastMark.outboundMarkTime,
										inboundMarkImage: lastMark.outboundMarkImage,
										outboundMarkTypeId: mark.typeMarkedId,
										outboundMarkTime: mark.markedTime,
										outboundMarkImage: mark.imageMarked,
										markedDate: mark.markedDate,
										entityId: mark.entityId,
										EmployeeId: mark.EmployeeId,
										key: mark.key,
										flag: true
									}
								else newMarkedEmployee = {
									inboundMarkTypeId: mark.typeMarkedId,
									inboundMarkTime: mark.markedTime,
									inboundMarkImage: mark.imageMarked,
									markedDate: mark.markedDate,
									entityId: mark.entityId,
									EmployeeId: mark.EmployeeId,
									key: mark.key,
									flag: true
								}
								let markFound = await Db.models.MarkedEmployees.findOne(
									{
										where: {
											entityId: mark.entityId,
											EmployeeId: mark.EmployeeId,
											markedDate: mark.markedDate,
											$or: [
												{ $and: [{ inboundMarkTypeId: mark.typeMarkedId }, { inboundMarkTime: mark.markedTime }] },
												{ $and: [{ outboundMarkTypeId: mark.typeMarkedId }, { outboundMarkTime: mark.markedTime }] }
											]
										},
										order: [['outboundMarkTime', 'DESC']]
									})
								if (!markFound)
									await Db.models.MarkedEmployees.create(newMarkedEmployee);

							}
						})
					if (i < data.length - 1)
						processData(i + 1)
					else resolve(args.MarkedEmployees);
				}
				if (data.length > 0)
					processData();
			})


		}
	},

	createMark: {
		type: MarkedEmployeesType,
		description: "Add a signle mark (in-out)",
		args: {
			input: { type: inputInsertMarkedEmployees }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees.create(args.input)
			.then(created => { return created });
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
	migrateNewMarkedEmployees: {
        type: GraphQLInt,
        description: 'migrate old data to new marked employee',
        args: {
            
        },
        async resolve(root, args){
            const data = await Db.models.MarkedEmployees_old.findAll({
                order: [
                    ['EmployeeId', 'DESC'],
                    ['entityId', 'DESC'],
                    ['markedDate', 'ASC'],
                    ['markedTime', 'ASC']
                ]
            });

            const inboundMark = (mark) => {
                return {
                    entityId: mark.entityId,
                    markedDate: mark.markedDate,
                    inboundMarkTypeId: mark.typeMarkedId,
                    inboundMarkTime: mark.markedTime,
					inboundMarkImage: mark.imageMarked,
                    positionId: null,
                    EmployeeId: mark.EmployeeId,
                    ShiftId: mark.ShiftId,
                    flag: mark.flag,
                    notes: mark.notes,
                    key: mark.key,
                    approvedDate: mark.approvedDate
                }
            }

            const outboundMark = (mark) => {
                return {
                    outboundMarkTypeId: mark.typeMarkedId,
                    outboundMarkTime: mark.markedTime,
                    outboundMarkImage: mark.imageMarked,
                }
            }

            const INBOUND_TYPE = 'inbound', OUTBOUND_TYPE = 'outbound';
            let control = INBOUND_TYPE;
			let saveData = [];
			let newRecord, editRecord, breakRecord, closeBreakRecord;
			
            let success = data.map(({dataValues: d}) => {
                if(control === OUTBOUND_TYPE && d.typeMarkedId != CLOCKIN && d.EmployeeId === newRecord.EmployeeId && d.markedDate === newRecord.markedDate && d.entityId === newRecord.entityId){
                    editRecord = outboundMark(d);
                    newRecord = {...newRecord, ...editRecord};
                    control = INBOUND_TYPE;
                    saveData = [...saveData, newRecord];
					newRecord = null;
					//break mark
					if(d.typeMarkedId !== CLOCKOUT){
						breakRecord = inboundMark(d);
					}
                }
                else if(d.typeMarkedId !== CLOCKOUT){
					//break mark
					if(breakRecord){
						if(d.typeMarkedId != CLOCKIN && breakRecord.EmployeeId === d.EmployeeId && breakRecord.markedDate === d.markedDate && breakRecord.entityId === d.entityId){
							closeBreakRecord = outboundMark(d);
							breakRecord = {...breakRecord, ...closeBreakRecord};
						}
						saveData = [...saveData, breakRecord];
						breakRecord = null;	
					}

                    if(newRecord && !newRecord.outboundMarkTypeId) saveData = [...saveData, newRecord];
                    newRecord = inboundMark(d);
                    control = OUTBOUND_TYPE;
                }

                return true;
            });

            return Promise.all(success).then(async _ => {
                return await Db.models.MarkedEmployees_tests.bulkCreate(saveData).then(output => {
                    return output ? output.length : 0;
                });
			});

        }
    }
};

export default MarkedEmployeesMutation;
