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
			return Db.models.ApplicantBackgroundChecks
				.update(
					{
						vehicleReportRequired: args.backgroundCheck.vehicleReportRequired,
						driverLicenseNumber: args.backgroundCheck.driverLicenseNumber,
						commercialDriverLicense: args.backgroundCheck.commercialDriverLicense,
						licenseState: args.backgroundCheck.licenseState,
						licenseExpiration: args.backgroundCheck.licenseExpiration,

						signature: args.backgroundCheck.signature,
						content: args.backgroundCheck.content,
						date: args.backgroundCheck.date,
						applicantName: args.backgroundCheck.applicantName,
						ApplicationId: args.backgroundCheck.ApplicationId
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
