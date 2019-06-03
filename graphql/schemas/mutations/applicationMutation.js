import { inputInsertApplication } from '../types/operations/insertTypes';
import { inputUpdateApplication } from '../types/operations/updateTypes';
import { ApplicationType } from '../types/operations/outputTypes';

import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';

const ApplicationMutation = {
	addApplication: {
		type: ApplicationType,
		description: 'Add application record to database',
		args: {
			application: { type: inputInsertApplication }
		},
		resolve(source, args) {
			return Db.models.Applications.create(args.application);
		}
	},
	updateApplication: {
		type: ApplicationType,
		description: 'Update Application Form Info',
		args: {
			application: { type: inputUpdateApplication }
		},
		resolve(source, args) {
			return Db.models.Applications
				.update(
					{
						firstName: args.application.firstName,
						middleName: args.application.middleName,
						lastName: args.application.lastName,
						lastName2: args.application.lastName2,
						date: args.application.date,
						streetAddress: args.application.streetAddress,
						emailAddress: args.application.emailAddress,
						aptNumber: args.application.aptNumber,
						city: args.application.city,
						state: args.application.state,
						zipCode: args.application.zipCode,
						homePhone: args.application.homePhone,
						cellPhone: args.application.cellPhone,
						socialSecurityNumber: args.application.socialSecurityNumber,
						positionApplyingFor: args.application.positionApplyingFor,
						birthDay: args.application.birthDay,
						car: args.application.car,
						typeOfId: args.application.typeOfId,
						expireDateId: args.application.expireDateId,
						dateAvailable: args.application.dateAvailable,
						scheduleRestrictions: args.application.scheduleRestrictions,
						scheduleExplain: args.application.scheduleExplain,
						convicted: args.application.convicted,
						convictedExplain: args.application.convictedExplain,
						comment: args.application.comment,
						generalComment: args.application.generalComment,
						idealJob: args.application.idealJob,
						idLanguage: args.application.idLanguage,
						signature: args.application.signature,
						isLead: args.application.isLead,
						isActive: args.application.isActive,
						Urlphoto: args.application.Urlphoto
					},
					{
						where: {
							id: args.application.id
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
			positionApplyingFor: { type: GraphQLInt }
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
					if (record) return record.dataValues;
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
			isActive:{ type: GraphQLBoolean }
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
					if (record) return record.dataValues;
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
