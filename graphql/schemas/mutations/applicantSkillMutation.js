import { inputInsertApplicantSkill } from '../types/operations/insertTypes';
import { inputUpdateApplicantSkill } from '../types/operations/updateTypes';
import { ApplicantSkillType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantSkillMutation = {
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
	},
	deleteApplicantSkill: {
		type: GraphQLInt,
		description: 'Delete applicant skill record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ApplicantSkills.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default ApplicantSkillMutation;
