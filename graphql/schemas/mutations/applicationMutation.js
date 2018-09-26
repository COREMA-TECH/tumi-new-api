import { inputInsertApplication } from '../types/operations/insertTypes';
import { inputUpdateApplication } from '../types/operations/updateTypes';
import { ApplicationType } from '../types/operations/outputTypes';

import Db from '../../models/models';

const ApplicationMutation = {
	addApplication: {
		type: ApplicationType,
		description: 'Add application record to database',
		args: {
			application: { type: inputInsertApplication }
		},
		resolve(source, args) {
			return Db.models.Applications.create({
				firstName: args.application.firstName,
				middleName: args.application.middleName,
				lastName: args.application.lastName,
				date: args.application.date,
				streetAddress: args.application.streetAddress,
				aptNumber: args.application.aptNumber,
				city: args.application.city,
				state: args.application.state,
				zipCode: args.application.zipCode,
				homePhone: args.application.homePhone,
				cellPhone: args.application.cellPhone,
				socialSecurityNumber: args.application.socialSecurityNumber,
				positionApplyingFor: args.application.positionApplyingFor,
				dateAvailable: args.application.dateAvailable,
				scheduleRestrictions: args.application.scheduleRestrictions,
				scheduleExplain: args.application.scheduleExplain,
				convicted: args.application.convicted,
				convictedExplain: args.application.convictedExplain,
				comment: args.application.comment
			});
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
						date: args.application.date,
						streetAddress: args.application.streetAddress,
						aptNumber: args.application.aptNumber,
						city: args.application.city,
						state: args.application.state,
						zipCode: args.application.zipCode,
						homePhone: args.application.homePhone,
						cellPhone: args.application.cellPhone,
						socialSecurityNumber: args.application.socialSecurityNumber,
						positionApplyingFor: args.application.positionApplyingFor,
						dateAvailable: args.application.dateAvailable,
						scheduleRestrictions: args.application.scheduleRestrictions,
						scheduleExplain: args.application.scheduleExplain,
						convicted: args.application.convicted,
						convictedExplain: args.application.convictedExplain,
						comment: args.application.comment
					},
					{
						where: {
							id: args.application.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ApplicationMutation;
