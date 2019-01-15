import { inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateShift } from '../types/operations/updateTypes';
import { ShiftType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import { sendworkorderfilledemail } from '../../../Configuration/Roots';

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
			let strEmployees = '';
			let employeeIdTemp = 0;
			let intPositionRateId = 0;
			let WOId = 0;
			let strEmail = '';
			let intEnvio = 0;

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
						Db.models.ShiftWorkOrder.findAll({ where: { ShiftId: args.id } }).then((select) => {
							select.map((datashiftworkOrder) => {
								Db.models.WorkOrder.findAll({ where: { id: datashiftworkOrder.dataValues.WorkOrderId } }).then((select) => {
									select.map((dataworkOrder) => {

										intPositionRateId = dataworkOrder.dataValues.PositionRateId;
										WOId = dataworkOrder.dataValues.id;

										Db.models.WorkOrder.update({ quantityFilled: dataworkOrder.dataValues.quantityFilled + 1 },
											{ where: { id: dataworkOrder.dataValues.id }, returning: true })

										if ((dataworkOrder.dataValues.quantityFilled + 1) == dataworkOrder.dataValues.quantity) {
											Db.models.Contacts.findAll({ where: { Id: dataworkOrder.dataValues.contactId } }).then((select) => {
												select.map((dataContacts) => {

													strEmail = dataContacts.dataValues.Electronic_Address;

													Db.models.ShiftWorkOrder.findAll({ where: { WorkOrderId: dataworkOrder.dataValues.id } }).then((select) => {
														select.map((dataWorkOrderShift) => {
															Db.models.ShiftDetail.findAll({ where: { ShiftId: dataWorkOrderShift.dataValues.ShiftId } }).then((select) => {
																select.map((dataShiftDetails) => {
																	Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: dataShiftDetails.dataValues.id } }).then((select) => {
																		select.map((dataShiftDetailEmployees) => {
																			Db.models.Employees.findAll({ where: { id: dataShiftDetailEmployees.dataValues.EmployeeId } }).then((select) => {
																				select.map((Employees) => {
																					if (employeeIdTemp != Employees.dataValues.id) {
																						strEmployees = strEmployees.trim() + ' - ' + Employees.dataValues.firstName.trim() + ' ' + Employees.dataValues.lastName.trim() + '<br> '
																						employeeIdTemp = Employees.dataValues.id;
																					}


																					Db.models.PositionRate.findAll({ where: { Id: intPositionRateId } }).then((select) => {
																						select.map((dataPositionRate) => {
																							if (intEnvio == 0) {
																								sendworkorderfilledemail({ email: strEmail, title: "Your order No. " + WOId + " has been fulfilled with position " + dataPositionRate.dataValues.Position, employees: strEmployees })
																								intEnvio = intEnvio + 1;
																							}
																						});
																					});

																				});
																			});

																		});
																	});

																});
															});


														});
													});


												});
											});
										}

									});
								});

							});
						});



					}

					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ShiftMutation;
