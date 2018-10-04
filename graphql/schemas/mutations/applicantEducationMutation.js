import { inputInsertApplicantEducation } from '../types/operations/insertTypes';
import { inputUpdateApplicantEducation } from '../types/operations/updateTypes';
import { ApplicantEducationType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantEducationMutation = {
	addApplicantEducation: {
		type: new GraphQLList(ApplicantEducationType),
		description: 'Add applicant educataion record to database',
		args: {
			applicantEducation: { type: new GraphQLList(inputInsertApplicantEducation) }
		},
		resolve(source, args) {
			return Db.models.ApplicantEducations
				.bulkCreate(args.applicantEducation, { returning: true })
				.then((applicantEducation) => {
					return applicantEducation.map((appEducataion) => {
						return appEducataion.dataValues;
					});
				});
		}
	},
	updateApplicantEducation: {
		type: ApplicantEducationType,
		description: 'Update Applicant Language Record Info',
		args: {
			applicantEducation: { type: inputUpdateApplicantEducation }
		},
		resolve(source, args) {
			return Db.models.ApplicantEducataions
				.update(
					{
						ApplicationId: args.applicantEducation.ApplicationId,
						schoolType: args.applicantEducation.schoolType,
						educationName: args.applicantEducation.educationName,
						educationAddress: args.applicantEducation.educationAddress,
						startDate: args.applicantEducation.startDate,
						endDate: args.applicantEducation.endDate,
						graduated: args.applicantEducation.graduated,
						degree: args.applicantEducation.degree
					},
					{
						where: {
							id: args.applicantEducation.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	deleteApplicantEducation: {
		type: GraphQLInt,
		description: 'Delete applicant educataion record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ApplicantEducations.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default ApplicantEducationMutation;
