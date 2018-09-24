import { inputInsertApplicantSkill } from '../types/operations/insertTypes';
import { inputUpdateApplicantSkill } from '../types/operations/updateTypes';
import { ApplicantSkillType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantSkillMutation = {
	addApplicantSkill: {
		type: ApplicantSkillType,
		description: 'Add applicant skill record to database',
		args: {
			applicantSkill: { type: inputInsertApplicantSkill }
		},
		resolve(source, args) {
			return Db.models.ApplicantSkills.create({
				ApplicationId: args.applicantSkill.ApplicationId,
				description: args.applicantSkill.description,
				level: args.applicantSkill.level
			});
		}
	},
	updateApplicantSkill: {
		type: ApplicantSkillType,
		description: 'Update Applicant Skill Record Info',
		args: {
			applicantSkill: { type: inputUpdateApplicantSkill }
		},
		resolve(source, args) {
			return Db.models.ApplicantSkills
				.update(
					{
						ApplicationId: args.applicantSkill.ApplicationId,
						description: args.applicantSkill.description,
						level: args.applicantSkill.level
					},
					{
						where: {
							id: args.applicantSkill.id
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

export default ApplicantSkillMutation;
