import { inputInsertType, inputUpdateType, applicantLanguageType } from './applicantLanguageType';
import Db from '../../models/models';

const ApplicantLanguageMutation = {
	addApplicantLanguage: {
		type: applicantLanguageType,
		description: 'Add applicant language record to database',
		args: {
			applicantLanguage: { type: inputInsertType }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages.create({
				idLanguage: args.applicantLanguage.idLanguage,
				writing: args.applicantLanguage.writing,
				conversation: args.applicantLanguage.conversation
			});
		}
	},
	updateApplicantLanguage: {
		type: applicantLanguageType,
		description: 'Delete application record to database',
		args: {
			application: { type: inputUpdateType }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages
				.update(
					{
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
