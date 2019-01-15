import { inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateShift } from '../types/operations/updateTypes';
import { ShiftType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, graphql } from 'graphql';
import { sendworkorderfilledemail } from '../../../Configuration/Roots';
import GraphQLDate from 'graphql-date';

import Sequelize from 'sequelize';
const Op = Sequelize.Op;


import Db from '../../models/models';

const ShiftMutation = {
	addShift: {
		type: new GraphQLList(ShiftType),
		description: 'Add Shift to database',
		args: {
			Shift: { type: new GraphQLList(inputInsertShift) }
		},
		resolve(source, args) {
			return Db.models.Shift.bulkCreate(args.Shift, { returning: true }).then((ret) => {
				return ret.map((data) => {
					//	sendgenericemail({ shift: datashift.dataValues.id, email: "mppomar@gmail.com", title: "New Shift publish" })


					return data.dataValues;
				});
			});
		}
	},
	updateShift: {
		type: ShiftType,
		description: 'Update Shift Info',
		args: {
			Shift: { type: inputUpdateShift }
		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					args.Shift,
					{
						where: {
							id: args.Shift.id
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
	destroyShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Shift.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},
	deleteShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Shift
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
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	changeStatusShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			id: { type: GraphQLInt },
			status: { type: GraphQLInt },
			color: { type: GraphQLString },
			comment: { type: GraphQLString }

		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					{
						status: args.status,
						color: args.color,
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

					if (args.status == 2) {
						//	console.log(dataContacts)
						Db.models.ShiftWorkOrder.findAll({ where: { ShiftId: args.id } }).then((select) => {
							select.map((datashiftworkOrder) => {

								Db.models.WorkOrder.findAll({ where: { id: datashiftworkOrder.dataValues.WorkOrderId } }).then((select) => {
									select.map((dataworkOrder) => {

										Db.models.WorkOrder.update({ quantityFilled: dataworkOrder.dataValues.quantityFilled + 1 },
											{ where: { id: dataworkOrder.dataValues.id }, returning: true })


										if ((dataworkOrder.dataValues.quantityFilled + 1) == dataworkOrder.dataValues.quantity) {
											Db.models.Contacts.findAll({ where: { Id: dataworkOrder.dataValues.contactId } }).then((select) => {
												select.map((dataContacts) => {


													Db.models.PositionRate.findAll({ where: { Id: dataworkOrder.dataValues.PositionRateId } }).then((select) => {
														select.map((dataPositionRate) => {
															sendworkorderfilledemail({ email: dataContacts.dataValues.Electronic_Address, title: "Your order No. " + dataworkOrder.dataValues.id + " has been fulfilled with position " + dataPositionRate.dataValues.Position })
														});
													});

												});
											});
										}

									});
								});

							});
						});

						/*Db.models.WorkOrder.findAll({ where: { id: datashiftworkOrder.dataValues.WorkOrderId } }).then((select) => {
							select.map((dataworkOrder) => {
								if (dataworkOrder.dataValues.quantityFilled == dataworkOrder.dataValues.quantity) {

									return Db.models.Contacts.findAll({ where: args });
									SendWorkOrderFilledEmail({ email: datashiftEmployee.dataValues.electronicAddress, title: args.shift.title })

								}
							});
						});*/
					}

					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	createTemplate: {
		type: new GraphQLList(ShiftType),
		description: 'Crate template to database',
		args: {
			shiftIds: { type: new GraphQLList(GraphQLInt) },
			startDate: { type: GraphQLDate },
			endDate: { type: GraphQLDate }
		},
		resolve(source, args) {
			args.shiftIds.map(shiftId => {
				Db.models.Shift.findAll({ where: { id: shiftId } }).then(data => {
					if (data.length > 0) {
						let shift = data[0].dataValues;

						shift.isTemplate = true;

						delete shift.createdAt;
						delete shift.updatedAt;
						delete shift.id;

						//Reaplce dayWeek string with numbers
						var weekDays = shift.dayWeek.replace("MO", 1).replace("TU", 2).replace("WE", 3).replace("TH", 4).replace("FR", 5).replace("SA", 6).replace("SU", 0)

						//Insert into Shift table
						Db.models.Shift.create(shift, { returning: true }).then(newShift => {
							Db.models.ShiftDetail.findAll({
								where: {
									ShiftId: shiftId,
									[Op.and]: [
										{ startDate: { [Op.gte]: args.startDate } },
										{ startDate: { [Op.lte]: args.endDate } }
									]
								}
							}).then(shiftDetails => {
								let _shiftDetail;
								shiftDetails.map(shiftDetail => {
									_shiftDetail = shiftDetail.dataValues;
									_shiftDetail.ShiftId = newShift.dataValues.id;
									var shiftDetailId = _shiftDetail.id;

									delete _shiftDetail.id;
									delete _shiftDetail.createdAt;
									delete _shiftDetail.updatedAt;

									Db.models.ShiftDetail.create(_shiftDetail, { returning: true }).then(newShiftDetail => {

										console.log(_shiftDetail);

										Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: shiftDetailId } })
											.then(shiftDetailsEmployee => {
												shiftDetailsEmployee.map(shiftDetailEmployee => {

													let _shiftDetailEmployee = shiftDetailEmployee.dataValues;

													_shiftDetailEmployee.ShiftDetailId = _shiftDetail.id;
													delete _shiftDetailEmployee.id;
													delete _shiftDetailEmployee.createdAt;
													delete _shiftDetailEmployee.updatedAt;
												})

											})
									})

								})
								// datesList.push({
								// 	startDate: currentDate,
								// 	endDate: currentDate,
								// 	startTime: args.startHour,
								// 	endTime: args.endHour
								// });

							})
						})

					}
				})
			})
		}
	}
};

export default ShiftMutation;
