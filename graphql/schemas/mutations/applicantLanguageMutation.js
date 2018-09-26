import { inputInsertApplicantLanguage } from '../types/operations/insertTypes';
import { inputUpdateApplicantLanguage } from '../types/operations/updateTypes';
import { ApplicantLanguageType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const ApplicantLanguageMutation = {
	/*	addApplicantLanguage: {
		type: ApplicantLanguageType,
		description: 'Add applicant language record to database',
		args: {
			applicantLanguage: { type: inputInsertApplicantLanguage }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages.create({
				ApplicationId: args.applicantLanguage.ApplicationId,
				language: args.applicantLanguage.language,
				writing: args.applicantLanguage.writing,
				conversation: args.applicantLanguage.conversation
			});
		}
	},*/
	addApplicantLanguage: {
		type: new GraphQLList(ApplicantLanguageType),
		description: 'Add applicant language record to database',
		args: {
			applicantLanguage: { type: new GraphQLList(inputInsertApplicantLanguage) }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages
				.bulkCreate(args.applicantLanguage, { returning: true })
				.then((applicantLanguages) => {
					return applicantLanguages.map((appLanguage) => {
						return appLanguage.dataValues;
					});
				});
		}
	},
	updateApplicantLanguage: {
		type: ApplicantLanguageType,
		description: 'Update Applicant Language Record Info',
		args: {
			applicantLanguage: { type: inputUpdateApplicantLanguage }
		},
		resolve(source, args) {
			return Db.models.ApplicantLanguages
				.update(
					{
						ApplicationId: args.applicantLanguage.ApplicationId,
						language: args.applicantLanguage.language,
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
