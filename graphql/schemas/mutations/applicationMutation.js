import { inputInsertApplication } from '../types/operations/insertTypes';
import { inputUpdateApplication } from '../types/operations/updateTypes';
import { ApplicationType } from '../types/operations/outputTypes';

import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import moment from 'moment-timezone';
import { SendSMS } from '../../../Configuration/Roots';

const ApplicationMutation = {
	addApplication: {
		type: ApplicationType,
		description: 'Add application record to database',
		args: {
			application: { type: inputInsertApplication },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString },
		},
		resolve(source, args) {

			return Db.models.Applications.create(args.application).then(application => {



				var userdate = new Date();
				var timezone = userdate.getTimezoneOffset();
				var serverdate = new Date(userdate.setMinutes(userdate.getMinutes() + parseInt(timezone)));
				serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');

				if (args.application.sendInterview) {
					SendSMS({
						msg: args.application.firstName + ' ' + args.application.lastName,
						number: args.application.cellPhone
					});
				}


				if (args.application.isLead) {
					Db.models.TransactionLogs.create({
						codeUser: args.codeuser,
						nameUser: args.nameUser,
						actionDate: serverdate,
						action: 'CREATED ROW',
						affectedObject: 'LEAD'
					});
				} else {
					Db.models.TransactionLogs.create({
						codeUser: args.codeuser,
						nameUser: args.nameUser,
						actionDate: serverdate,
						action: 'CREATED ROW',
						affectedObject: 'EMPLOYEE PACKAGE'
					});
				}

				return application.dataValues;

			});
		}
	},
	updateApplication: {
		type: ApplicationType,
		description: 'Update Application Form Info',
		args: {
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString },
			application: { type: inputUpdateApplication }
		},
		resolve(source, args) {

			return Db.models.Applications
				.update(args.application,
					{
						where: {
							id: args.application.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) {
						if (args.application.sendInterview) {
							SendSMS({
								msg: args.application.firstName + ' ' + args.application.lastName,
								number: args.application.cellPhone
							});
						}

						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes() + parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');

						if (args.application.isLead) {
							Db.models.TransactionLogs.create({
								codeUser: args.codeuser,
								nameUser: args.nameUser,
								actionDate: serverdate,
								action: 'UPDATED ROW',
								affectedObject: 'LEAD'
							});
						} else {
							Db.models.TransactionLogs.create({
								codeUser: args.codeuser,
								nameUser: args.nameUser,
								actionDate: serverdate,
								action: 'UPDATED ROW',
								affectedObject: 'EMPLOYEE PACKAGE'
							});
						}
						return record.dataValues;
					}
					else return null;
				});
		}
	},
	updateUrlphoto: {
		type: ApplicationType,
		description: 'Update Application Form Info',
		args: {
			id: { type: GraphQLInt },
			Urlphoto: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						Urlphoto: args.Urlphoto
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
	updateDirectDeposit: {
		type: ApplicationType,
		description: 'Update Direct Deposit',
		args: {
			id: { type: GraphQLInt },
			directDeposit: { type: GraphQLBoolean }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						directDeposit: args.directDeposit
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
	updateApplicationConvertLead: {
		type: ApplicationType,
		description: 'Update Lead Aplicant Form Info',
		args: {
			id: { type: GraphQLInt },
			isLead: { type: GraphQLBoolean },
			idRecruiter: { type: GraphQLInt },
			idWorkOrder: { type: GraphQLInt },
			positionApplyingFor: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						isLead: args.isLead,
						idRecruiter: args.idRecruiter,
						idWorkOrder: args.idWorkOrder,
						positionApplyingFor: args.positionApplyingFor

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
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes() + parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');

						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'EMPLOYEE PACKAGE'
						});

						return record.dataValues;
					}
					else return null;
				});
		}
	},
	updateApplicationMoveStage: {
		type: ApplicationType,
		description: 'Update Lead Aplicant Form Info',
		args: {
			id: { type: GraphQLInt },
			idStages: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						idStages: args.idStages
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
	disableApplication: {
		type: ApplicationType,
		description: 'Disable Application Form Info',
		args: {
			id: { type: GraphQLInt },
			isActive: { type: GraphQLBoolean },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {

			return Db.models.Applications
				.update(
					{
						isActive: args.isActive
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
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes() + parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');


						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'DELETE ROW',
							affectedObject: 'EMPLOYEE PACKAGE'
						});

						return record.dataValues;
					}

					else return null;
				});
		}
	},
	addSignature: {
		type: ApplicationType,
		description: 'Udd signature to Application Form Info',
		args: {
			id: { type: GraphQLInt },
			signature: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						signature: args.signature
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
	}
};

export default ApplicationMutation;
