import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantSkillType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantSkillQuery = {
	applicantSkills: {
		type: new GraphQLList(ApplicantSkillType),
		description: 'List skills of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantSkills.findAll({ where: args });
		}
	}
};

export default ApplicantSkillQuery;
