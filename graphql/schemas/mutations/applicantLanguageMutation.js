import { inputInsertApplicantLanguage } from '../types/operations/insertTypes';
import { inputUpdateApplicantLanguage } from '../types/operations/updateTypes';
import { ApplicantLanguageType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantLanguageMutation = {
	addApplicantLanguage: {
		type: ApplicantLanguageType,
		description: 'Add applicant language record to database',
		args: {
			applicantLanguage: { type: inputInsertApplicantLanguage }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages.create({
				ApplicationId: args.applicantLanguage.ApplicationId,
				idLanguage: args.applicantLanguage.idLanguage,
				writing: args.applicantLanguage.writing,
				conversation: args.applicantLanguage.conversation
			});
		}
	},
	updateApplicantLanguage: {
		type: ApplicantLanguageType,
		description: 'Delete application record to database',
		args: {
			application: { type: inputUpdateApplicantLanguage }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages
				.update(
					{
						ApplicationId: args.applicantLanguage.ApplicationId,
						idLanguage: args.applicantLanguage.idLanguage,
						writing: args.applicantLanguage.writing,
						conversation: args.applicantLanguage.conversation
					},
					{
						where: {
							id: args.applicantLanguage.id
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

export default ApplicantLanguageMutation;
