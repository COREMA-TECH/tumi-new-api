import { inputInsertApplicantPreviousEmployment } from '../types/operations/insertTypes';
import { inputUpdateApplicantPreviousEmployment } from '../types/operations/updateTypes';
import { ApplicantPreviousEmploymentType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantPreviousEmploymentMutation = {
	addApplicantPreviousEmployment: {
		type: ApplicantPreviousEmploymentType,
		description: 'Add applicant previous employment record to database',
		args: {
			applicantPreviousEmployment: { type: inputInsertApplicantPreviousEmployment }
		},
		resolve(source, args) {
			return Db.models.ApplicantPreviousEmployments.create({
				ApplicationId: args.applicantPreviousEmployment.ApplicationId,
				companyName: args.applicantPreviousEmployment.idLanguage,
				phone: args.applicantPreviousEmployment.writing,
				address: args.applicantPreviousEmployment.conversation,
				supervisor: args.applicantPreviousEmployment.idLanguage,
				jobTitle: args.applicantPreviousEmployment.writing,
				payRate: args.applicantPreviousEmployment.conversation,
				startDate: args.applicantPreviousEmployment.writing,
				endDate: args.applicantPreviousEmployment.conversation,
				reasonForLeaving: args.applicantPreviousEmployment.writing
			});
		}
	},
	updateApplicantPreviousEmployment: {
		type: ApplicantPreviousEmploymentType,
		description: 'Update Applicant previous employment Record Info',
		args: {
			applicantLanguage: { type: inputUpdateApplicantPreviousEmployment }
		},
		resolve(source, args) {
			return Db.models.ApplicantPreviousEmployments
				.update(
					{
						ApplicationId: args.applicantPreviousEmployment.ApplicationId,
						companyName: args.applicantPreviousEmployment.idLanguage,
						phone: args.applicantPreviousEmployment.writing,
						address: args.applicantPreviousEmployment.conversation,
						supervisor: args.applicantPreviousEmployment.idLanguage,
						jobTitle: args.applicantPreviousEmployment.writing,
						payRate: args.applicantPreviousEmployment.conversation,
						startDate: args.applicantPreviousEmployment.writing,
						endDate: args.applicantPreviousEmployment.conversation,
						reasonForLeaving: args.applicantPreviousEmployment.writing
					},
					{
						where: {
							id: args.applicantPreviousEmployment.id
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

export default ApplicantPreviousEmploymentMutation;
