import { inputInsertApplicantBackgroundCheck } from '../types/operations/insertTypes';
import { inputUpdateApplicantBackgroundCheck } from '../types/operations/updateTypes';
import { ApplicantBackgroundCheckType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantBackgroundCheckMutation = {
	addBackgroundCheck: {
		type: new GraphQLList(ApplicantBackgroundCheckType),
		description: 'Add applicant background check record to database',
		args: {
			backgroundCheck: { type: new GraphQLList(inputInsertApplicantBackgroundCheck) }
		},
		resolve(source, args) {
			return Db.models.ApplicantBackgroundChecks
				.bulkCreate(args.backgroundCheck, { returning: true })
				.then((output) => {
					return output.map((element) => {
						return element.dataValues;
					});
				});
		}
	},
	updateBackgroundCheck: {
		type: ApplicantBackgroundCheckType,
		description: 'Update Applicant Background Check Record Info',
		args: {
			backgroundCheck: { type: inputUpdateApplicantBackgroundCheck }
		},
		resolve(source, args) {
			// Cada actualizacion borrará la url del pdf a menos que se pase la url como argumento
			let backgroundCheck = args.backgroundCheck.pdfUrl ? args.backgroundCheck : {...args.backgroundCheck, pdfUrl: null} ;
			return Db.models.ApplicantBackgroundChecks
				.update(
					{
						...backgroundCheck
					},
					{
						where: {
							id: args.backgroundCheck.id
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

export default ApplicantBackgroundCheckMutation;
