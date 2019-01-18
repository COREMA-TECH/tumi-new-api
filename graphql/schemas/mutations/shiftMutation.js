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
	},
	createTemplate: {
		type: new GraphQLList(ShiftType),
		description: 'Create template to database',
		args: {
			shiftIds: { type: new GraphQLList(GraphQLInt) },
			title: { type: GraphQLString },
			endDate: { type: GraphQLDate }
		},
		resolve(source, args) {
			//Create a new date based on endDate  and substract 6 days
			var startDate = new Date(args.endDate)
			startDate.setDate(startDate.getDate() - 6);

			//Create header template
			return Db.models.Template.create({ title: args.title }, { returning: true })
				.then(template => {
					//Loop for eacth Shift sent as parameter
					args.shiftIds.map(shiftId => {
						//For each Id in the array we are getting the info from database
						return Db.models.Shift.findAll({ where: { id: shiftId } }).then(data => {
							//Validate if the id is giving a result
							if (data.length > 0) {
								let shift = data[0].dataValues;
								//Override actual data with new data
								shift.isTemplate = true;

								//Delete some properties from the original object to use it to create the new object
								delete shift.createdAt;
								delete shift.updatedAt;
								delete shift.id;

								//Insert into Shift table using the info of the new object
								return Db.models.Shift.create(shift, { returning: true }).then(newShift => {
									//Crate TemplateShift record , using TemplateId from the new template just created
									//and ShiftId from the new Shift just createad 
									return Db.models.TemplateShift.create({ TemplateId: template.dataValues.id, ShiftId: newShift.dataValues.id })
										.then(_newTemplateShift => {
											//Get all ShiftDetail records linked to every current shift in the map function
											//note: these ShiftDetail must me filtered by date range to get the needed week
											return Db.models.ShiftDetail.findAll({
												where: {
													ShiftId: shiftId,
													[Op.and]: [
														{ startDate: { [Op.gte]: startDate } },
														{ startDate: { [Op.lte]: args.endDate } }
													]
												}
											}).then(shiftDetails => {
												let _shiftDetail;
												//Loop through every shiftDetail found to create a new one based on it
												shiftDetails.map(shiftDetail => {
													//Get current shiftDetail
													_shiftDetail = shiftDetail.dataValues;
													//Replace shiftId with the new shiftId
													_shiftDetail.ShiftId = newShift.dataValues.id;
													//Save shiftDetailId into variable to filter ShiftDetailEmployee recors 
													var shiftDetailId = _shiftDetail.id;

													//Delete unnecessary properties to create new shiftDetail record
													delete _shiftDetail.id;
													delete _shiftDetail.createdAt;
													delete _shiftDetail.updatedAt;

													//Create new ShiftDetail record
													return Db.models.ShiftDetail.create(_shiftDetail, { returning: true }).then(newShiftDetail => {
														//Get ShiftDetailEmployees record associated with current ShiftDetail to create a copy
														return Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: shiftDetailId } })
															.then(shiftDetailsEmployee => {
																//Loop throug every shiftDetailEmployee
																shiftDetailsEmployee.map(shiftDetailEmployee => {
																	//Save current record into variable
																	let _shiftDetailEmployee = shiftDetailEmployee.dataValues;
																	//Replace ShiftDetailId with the id of the ShiftDetail record just created
																	_shiftDetailEmployee.ShiftDetailId = newShiftDetail.dataValues.id;
																	//Delete unnecessary properties to create new ShiftDetailEmployee record
																	delete _shiftDetailEmployee.id;
																	delete _shiftDetailEmployee.createdAt;
																	delete _shiftDetailEmployee.updatedAt;

																	return Db.models.ShiftDetailEmployees.create(_shiftDetailEmployee, { returning: true })
																		.then(newShiftDetailEmployee => {
																		})
																})
															})
													})
												})
											})
										})
								})
							}
						})
					})
				})

		}
	},
	disableShift: {
		type: ShiftType,
		description: 'Disable Shift Record',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					{
						isActive: false
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
	createShiftBasedOnTemplate: {
		type: new GraphQLList(ShiftType),
		description: 'Create  shifts based on templates',
		args: {
			templateId: { type: GraphQLInt },
			endDate: { type: GraphQLDate },
			userId: { type: GraphQLInt },
			positionId: { type: GraphQLInt },
			requestedBy: { type: GraphQLInt },
			specialComment: { type: GraphQLString }
		},
		resolve(source, args) {
			//Create a new date based on endDate  and substract 6 days
			var startDate = new Date(args.endDate)
			startDate.setDate(startDate.getDate() - 6);

			//Get all the relations between Shift and Template
			return Db.models.TemplateShift.findAll({ where: { TemplateId: args.templateId } }, { returning: true }).then(templateShift => {
				//Loop trough every record to get associated shift
				templateShift.map(_templateShift => {
					let shiftId = _templateShift.dataValues.ShiftId;
					return Db.models.Shift.findAll({ where: { id: shiftId } }).then(shift => {
						//Validate if the id is giving a result
						if (shift.length > 0) {
							let _shift = shift[0].dataValues;
							//Override actual data with new data
							_shift.isTemplate = false;

							_shift.startDate = startDate;
							_shift.endDate = args.endDate;

							//Delete some properties from the original object to use it to create the new object
							delete _shift.createdAt;
							delete _shift.updatedAt;
							delete _shift.id;

							//Insert into Shift table using the info of the new object
							return Db.models.Shift.create(_shift, { returning: true }).then(newShift => {

								return Db.models.ShiftDetailEmployees.findAll({
									include: [
										{
											model: Db.models.ShiftDetail,
											where: { ShiftId: shiftId }
										}
									]
								}).then(employees => {

									//Create Work Order
									return Db.models.WorkOrder.create({
										IdEntity: _shift.entityId,
										userId: args.userId,
										date: args.endDate,
										status: 1,
										quantity: employees.length,
										shift: "00:00",
										startDate: startDate,
										endDate: args.endDate,
										needExperience: false,
										needEnglish: false,
										comment: _shift.comment,
										PositionRateId: args.positionId,
										contactId: args.requestedBy,
										EspecialComment: args.specialComment,
										endShift: "00:23",
										dayWeek: _shift.dayWeek,
										quantityFilled: 0
									}).then(workOrder => {
										//Create Realation between WorkOrder and Shift
										return Db.models.ShiftWorkOrder.create({ ShiftId: newShift.dataValues.id, WorkOrderId: workOrder.dataValues.id })
											.then(shiftWorkOrder => {
												//Get all ShiftDetail records linked to every current shift in the map function
												//note: these ShiftDetail must me filtered by date range to get the needed week
												return Db.models.ShiftDetail.findAll({
													where: {
														ShiftId: shiftId
													}
												}).then(shiftDetails => {
													let _shiftDetail;

													//Loop through every shiftDetail found to create a new one based on it
													shiftDetails.map(shiftDetail => {
														//Get current shiftDetail
														_shiftDetail = shiftDetail.dataValues;
														//Replace shiftId with the new shiftId
														_shiftDetail.ShiftId = newShift.dataValues.id;
														//Save shiftDetailId into variable to filter ShiftDetailEmployee recors 
														var shiftDetailId = _shiftDetail.id;

														//Delete unnecessary properties to create new shiftDetail record
														delete _shiftDetail.id;
														delete _shiftDetail.createdAt;
														delete _shiftDetail.updatedAt;

														var currentDate = new Date(startDate);
														//Get every day between startDate and endDate to generate ShiftDetail records
														while (currentDate <= args.endDate) {
															var newDate = new Date(currentDate)
															if (currentDate.getDay() == _shiftDetail.startDate.getDay()) {
																_shiftDetail.startDate = newDate;
																_shiftDetail.endDate = newDate;
															}
															currentDate.setDate(currentDate.getDate() + 1)
														}
														//Insert new shiftDetail records into database
														return Db.models.ShiftDetail.create(_shiftDetail, { returning: true }).then(newShiftDetail => {
															//Get ShiftDetailEmployees record associated with current ShiftDetail to create a copy
															return Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: shiftDetailId } })
																.then(shiftDetailsEmployee => {
																	//Loop throug every shiftDetailEmployee
																	shiftDetailsEmployee.map(shiftDetailEmployee => {
																		//Save current record into variable
																		let _shiftDetailEmployee = shiftDetailEmployee.dataValues;
																		//Replace ShiftDetailId with the id of the ShiftDetail record just created
																		_shiftDetailEmployee.ShiftDetailId = newShiftDetail.dataValues.id;
																		//Delete unnecessary properties to create new ShiftDetailEmployee record
																		delete _shiftDetailEmployee.id;
																		delete _shiftDetailEmployee.createdAt;
																		delete _shiftDetailEmployee.updatedAt;

																		return Db.models.ShiftDetailEmployees.create(_shiftDetailEmployee, { returning: true })
																			.then(newShiftDetailEmployee => {

																			})
																	})
																})
														})
													})
												})
											})
									})
								})
							})
						}
					})
				})
			})
			return null;
		}

	},
	createPreviousWeekShift: {
		type: new GraphQLList(ShiftType),
		description: 'Create  shifts based on previous week',
		args: {
			endDate: { type: GraphQLDate },
			entityId: { type: GraphQLInt },
			positionId: { type: GraphQLInt },
			userId: { type: GraphQLInt }
		},
		resolve(source, args) {

			//Create a new date based on endDate  and substract 6 days
			var startDate = new Date(args.endDate)
			startDate.setDate(startDate.getDate() - 6);


			//Create new date range
			var newStartDate = new Date(args.endDate);
			newStartDate.setDate(newStartDate.getDate() + 1);//Add one day
			var newEndDate = new Date(newStartDate)//Add six days
			newEndDate.setDate(newEndDate.getDate() + 6);//Add one day

			return Db.models.Shift.findAll({
				where: {
					idPosition: args.positionId,
					entityId: args.entityId,
					isTemplate: false,
					isActive: true,
				},
				include: [
					{
						model: Db.models.ShiftDetail,
						where: {
							[Op.and]: [
								{ startDate: { [Op.gte]: startDate } },
								{ startDate: { [Op.lte]: args.endDate } }
							]
						}
					}
				]
			}).then(shift => {
				//Validate if the id is giving a result
				if (shift.length > 0) {
					let _shift = shift[0].dataValues;

					//Override actual data with new data
					_shift.startDate = newStartDate;
					_shift.endDate = newEndDate;

					//Delete some properties from the original object to use it to create the new object
					delete _shift.createdAt;
					delete _shift.updatedAt;
					delete _shift.id;

					//Insert into Shift table using the info of the new object
					return Db.models.Shift.create(_shift, { returning: true }).then(newShift => {

						return Db.models.ShiftDetailEmployees.findAll({
							include: [
								{
									model: Db.models.ShiftDetail,
									where: {

										[Op.and]: [
											{ startDate: { [Op.gte]: startDate } },
											{ startDate: { [Op.lte]: args.endDate } }
										]
									},
									include: [
										{
											model: Db.models.Shift,
											where: {
												idPosition: args.positionId,
												entityId: args.entityId,
												isTemplate: false,
												isActive: true
											}
										}
									]
								}

							]
						}).then(employees => {

							//Create Work Order
							return Db.models.WorkOrder.create({
								IdEntity: _shift.entityId,
								userId: args.userId,
								date: args.endDate,
								status: 1,
								quantity: employees.length,
								shift: "00:00",
								startDate: newStartDate,
								endDate: newEndDate,
								needExperience: false,
								needEnglish: false,
								comment: _shift.comment,
								PositionRateId: args.positionId,
								contactId: args.requestedBy,
								EspecialComment: args.specialComment,
								endShift: "00:23",
								dayWeek: _shift.dayWeek,
								quantityFilled: 0
							}).then(workOrder => {
								//Create Realation between WorkOrder and Shift
								return Db.models.ShiftWorkOrder.create({ ShiftId: newShift.dataValues.id, WorkOrderId: workOrder.dataValues.id })
									.then(shiftWorkOrder => {
										//Get all ShiftDetail records linked to every current shift in the map function
										//note: these ShiftDetail must me filtered by date range to get the needed week
										return Db.models.ShiftDetail.findAll({
											where: {
												[Op.and]: [
													{ startDate: { [Op.gte]: startDate } },
													{ startDate: { [Op.lte]: args.endDate } }
												]
											},
											include: [
												{
													model: Db.models.Shift,
													where: {
														idPosition: args.positionId,
														entityId: args.entityId,
														isTemplate: false,
														isActive: true
													}
												}
											]
										}).then(shiftDetails => {
											let _shiftDetail;

											//Loop through every shiftDetail found to create a new one based on it
											shiftDetails.map(shiftDetail => {
												//Get current shiftDetail
												_shiftDetail = shiftDetail.dataValues;
												//Replace shiftId with the new shiftId
												_shiftDetail.ShiftId = newShift.dataValues.id;
												//Save shiftDetailId into variable to filter ShiftDetailEmployee recors 
												var shiftDetailId = _shiftDetail.id;

												//Delete unnecessary properties to create new shiftDetail record
												delete _shiftDetail.id;
												delete _shiftDetail.createdAt;
												delete _shiftDetail.updatedAt;

												var currentDate = new Date(newStartDate);
												//Get every day between startDate and endDate to generate ShiftDetail records
												while (currentDate <= newEndDate) {
													var newDate = new Date(currentDate)
													if (currentDate.getDay() == _shiftDetail.startDate.getDay()) {
														_shiftDetail.startDate = newDate;
														_shiftDetail.endDate = newDate;
													}
													currentDate.setDate(currentDate.getDate() + 1)
												}
												//Insert new shiftDetail records into database
												return Db.models.ShiftDetail.create(_shiftDetail, { returning: true }).then(newShiftDetail => {
													//Get ShiftDetailEmployees record associated with current ShiftDetail to create a copy
													return Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: shiftDetailId } })
														.then(shiftDetailsEmployee => {
															//Loop throug every shiftDetailEmployee
															shiftDetailsEmployee.map(shiftDetailEmployee => {
																//Save current record into variable
																let _shiftDetailEmployee = shiftDetailEmployee.dataValues;
																//Replace ShiftDetailId with the id of the ShiftDetail record just created
																_shiftDetailEmployee.ShiftDetailId = newShiftDetail.dataValues.id;
																//Delete unnecessary properties to create new ShiftDetailEmployee record
																delete _shiftDetailEmployee.id;
																delete _shiftDetailEmployee.createdAt;
																delete _shiftDetailEmployee.updatedAt;

																return Db.models.ShiftDetailEmployees.create(_shiftDetailEmployee, { returning: true })
																	.then(newShiftDetailEmployee => {

																	})
															})

														})
												})
											})
										})
									})
							})

						})
					})
				}
			})

			return null;
		}
	},
	NotifyAllEmployees: {
		type: new GraphQLList(ShiftType),
		description: 'Notify all employees by shifts',
		args: {
			ids: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ShiftDetailEmployees.findAll({
				attributes: [
					"EmployeeId"

				],
				include: [
					{
						model: Db.models.ShiftDetail,
						attributes: {
							exclude: [
								"id",
								"createdAt",
								"updatedAt"
							]
						},
						where: {
							ShiftId: { [Op.in]: args.ids }
						},
						raw: true,
					}
				]
			}).then((Employees) => {
				let __employees = [];
				const details = Employees.map((node) => node.get({ plain: true }));

				details.map((detail) => {
					return Db.models.Employees.findAll({
						where: {
							id: detail.EmployeeId
						}
					}).then((data) => {
						const mailData = {
							startDate: detail.ShiftDetail.startDate,
							toDate: detail.ShiftDetail.endDate,
							ShiftStart: detail.ShiftDetail.startTime,
							ShiftEnd: detail.ShiftDetail.endTime,
							shift: detail.ShiftDetail.ShiftId,
							email: da
						};
						data.forEach((Employee) => {
							sendgenericemail({
								StartDate: mailData.startDate.toISOString().substring(0, 10),
								ToDate: mailData.endDate.toISOString().substring(0, 10),
								ShiftStart: mailData.startHour,
								ShiftEnd: mailData.endHour,
								shift: mailData.ShiftId,
								email: datashiftEmployee.dataValues.electronicAddress,
								title: dataPositionRate.dataValues.Position,
								supervisor: dataContacts.dataValues.First_Name.trim + ' ' + dataContacts.dataValues.Last_Name,
								Department: dataCatalogItem.dataValues.DisplayLabel,
								Hotel: dataBusinessCompany.dataValues.Name,
								Workdays: weekDays,
								specialComment: dataPositionRate.dataValues.Comment
							})
						});
					});
				});

			});
		}
	},
	PublishAll: {
		type: new GraphQLList(ShiftType),
		description: 'Notify all employees by shifts',
		args: {
			ids: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.update({
				color: "#009ce0",
				status: 3
			}, {
					where: {
						ShiftId: { [Op.in]: args.ids },
						status: 2
					}
				});
		}
	}
}

export default ShiftMutation;
