import { inputInsertApplicantEducation } from '../types/operations/insertTypes';
import { inputUpdateApplicantEducation } from '../types/operations/updateTypes';
import { ApplicantEducationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantEducationMutation = {
	addApplicantEducation: {
		type: ApplicantEducationType,
		description: 'Add applicant educataion record to database',
		args: {
			applicantEducation: { type: inputInsertApplicantEducation }
		},
		resolve(source, args) {
			return Db.models.ApplicantEducations.create({
				ApplicationId: args.applicantEducation.ApplicationId,
				schoolType: args.applicantEducation.schoolType,
				educationName: args.applicantEducation.educationName,
				educationAddress: args.applicantEducation.educationAddress,
				startDate: args.applicantEducation.startDate,
				endDate: args.applicantEducation.endDate,
				graduated: args.applicantEducation.graduated,
				degree: args.applicantEducation.degree
			});
		}
	},
	updateApplicantLanguage: {
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
	}
};

export default ApplicantEducationMutation;
