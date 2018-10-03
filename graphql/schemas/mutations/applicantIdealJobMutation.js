import { inputInsertApplicantIdealJob } from '../types/operations/insertTypes';
import { inputUpdateApplicantIdealJob } from '../types/operations/updateTypes';
import { ApplicantIdealJobType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const ApplicantIdealJobMutation = {
	addApplicantIdealJob: {
		type: new GraphQLList(ApplicantIdealJobType),
		description: 'Add applicant ideal job record to database',
		args: {
			applicantIdealJob: { type: new GraphQLList(inputInsertApplicantIdealJob) }
		},
		resolve(source, args) {
			return Db.models.ApplicantIdealJobs
				.bulkCreate(args.applicantIdealJob, { returning: true })
				.then((applicantIdealJob) => {
					return applicantIdealJob.map((appIdJob) => {
						return appIdJob.dataValues;
					});
				});
		}
	},
	updateApplicantIdealJob: {
		type: ApplicantIdealJobType,
		description: 'Update Applicant Ideal Job Record Info',
		args: {
			applicantIdealJob: { type: inputUpdateApplicantIdealJob }
		},
		resolve(source, args) {
			return Db.models.ApplicantIdealJobs
				.update(
					{
						ApplicationId: args.applicantIdealJob.ApplicationId,
						description: args.applicantIdealJob.description
					},
					{
						where: {
							id: args.applicantIdealJob.id
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

export default ApplicantIdealJobMutation;
