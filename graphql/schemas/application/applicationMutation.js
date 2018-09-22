import { inputType, outputType } from './applicationType';
import Db from '../../models/models';

const ApplicationMutation = {
	addApplication: {
		type: outputType,
		description: 'Add application record to database',
		args: {
			application: { type: inputType }
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
	}
};

export default ApplicationMutation;
