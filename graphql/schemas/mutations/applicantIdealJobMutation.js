import { inputInsertApplicantIdealJob } from '../types/operations/insertTypes';
import { inputUpdateApplicantIdealJob } from '../types/operations/updateTypes';
import { ApplicantIdealJobType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';
import Sequelize from 'sequelize';
const Op = Sequelize.Op;

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
						description: args.applicantIdealJob.description,
						idPosition: args.applicantIdealJob.idPosition
					},
					{
						where: {
							id: args.applicantIdealJob.id
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
	setDefaultApplicantIdealJob: {
		type: ApplicantIdealJobType,
		description: 'Set Default Applicant Ideal Job Record Info',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ApplicantIdealJobs
				.update(
					{
						isDefault: true
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					let appIdealJob;
					if (record){
						appIdealJob = record.dataValues;
						return Db.models.ApplicantIdealJobs
								.update(
									{isDefault: false},
									{
										where: {
										[Op.and]: [
											{ApplicationId: appIdealJob.ApplicationId},
											{id: {[Op.ne]: appIdealJob.id}},
											{isDefault: true}
										]},
										returning: true
									})
									.then(() => {
										return appIdealJob;
									})
									.catch(() => {
										return appIdealJob;
									});
					} 
					return null;
				});
		}
	},
	deleteApplicantIdealJob: {
		type: GraphQLInt,
		description: 'Delete ideal job record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ApplicantIdealJobs.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},
	recreateIdealJobs: {
		type: new GraphQLList(ApplicantIdealJobType),
		description: 'Delete ideal job record from database',
		args: {
			ApplicationId: { type: GraphQLInt },
			applicantIdealJob: { type: new GraphQLList(inputInsertApplicantIdealJob) }
		},
		resolve(source, args) {
			return Db.models.ApplicantIdealJobs.destroy({ where: { ApplicationId: args.ApplicationId } })
				.then((deleted) => {
					return Db.models.ApplicantIdealJobs
						.bulkCreate(args.applicantIdealJob, { returning: true })
						.then((applicantIdealJob) => {
							return applicantIdealJob.map((appIdJob) => {
								return appIdJob.dataValues;
							});
						});

				});
		}
	}
};

export default ApplicantIdealJobMutation;
