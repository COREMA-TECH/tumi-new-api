import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantEducationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantEducationQuery = {
	applicantEducations: {
		type: new GraphQLList(ApplicantEducationType),
		description: 'List educations of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantEducations.findAll({ where: args });
		}
	}
};

export default ApplicantEducationQuery;
