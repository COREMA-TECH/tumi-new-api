import { inputInsertApplicantWorkerCompensation } from '../types/operations/insertTypes';
import { inputUpdateApplicantWorkerCompensation } from '../types/operations/updateTypes';
import { ApplicantWorkerCompensationType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantWorkerCompensationMutation = {
	addWorkerCompensation: {
		type: new GraphQLList(ApplicantWorkerCompensationType),
		description: 'Add worker compensation to database',
		args: {
			workerCompensation: { type: new GraphQLList(inputInsertApplicantWorkerCompensation) }
		},
		resolve(source, args) {
			return Db.models.ApplicantWorkerCompensation
				.bulkCreate(args.workerCompensation, { returning: true })
				.then((output) => {
					return output.map((element) => {
						return element.dataValues;
					});
				});
		}
	},
	updateWorkerCompensation: {
		type: ApplicantWorkerCompensationType,
		description: 'Update Worker Compensation Record Info',
		args: {
			workerCompensation: { type: inputUpdateApplicantWorkerCompensation }
		},
		resolve(source, args) {
			return Db.models.ApplicantWorkerCompensation
				.update(
					{
						applicantAddress: args.workerCompensation.applicantAddress,
						applicantCity: args.workerCompensation.applicantCity,
						applicantState: args.workerCompensation.applicantState,
						applicantZipCode: args.workerCompensation.applicantZipCode,
						employerName: args.workerCompensation.employerName,
						initialNotification: args.workerCompensation.initialNotification,
						injuryNotification: args.workerCompensation.injuryNotification,
						injuryDate: args.workerCompensation.injuryDate,

						signature: args.workerCompensation.signature,
						content: args.workerCompensation.content,
						date: args.workerCompensation.date,
						applicantName: args.workerCompensation.applicantName,
						ApplicationId: args.workerCompensation.ApplicationId
					},
					{
						where: {
							id: args.workerCompensation.id
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

export default ApplicantWorkerCompensationMutation;
