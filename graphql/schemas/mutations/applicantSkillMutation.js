import { inputInsertApplicantSkill } from '../types/operations/insertTypes';
import { inputUpdateApplicantSkill } from '../types/operations/updateTypes';
import { ApplicantSkillType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const ApplicantSkillMutation = {
	/*addApplicantSkill: {
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
	},*/
	addApplicantSkill: {
		type: new GraphQLList(ApplicantSkillType),
		description: 'Add applicant skill record to database',
		args: {
			applicantSkill: { type: new GraphQLList(inputInsertApplicantSkill) }
		},
		resolve(source, args) {
			return Db.models.ApplicantSkills
				.bulkCreate(args.applicantSkill, { returning: true })
				.then((applicantSkills) => {
					return applicantSkills.map((appSkills) => {
						return appSkills.dataValues;
					});
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
