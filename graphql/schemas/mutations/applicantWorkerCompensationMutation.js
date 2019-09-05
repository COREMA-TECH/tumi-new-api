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
			let workerCompensation = args.workerCompensation.pdfUrl ? args.workerCompensation : {...args.workerCompensation, pdfUrl: null};
			return Db.models.ApplicantWorkerCompensation
				.update(
					{
						...workerCompensation
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
