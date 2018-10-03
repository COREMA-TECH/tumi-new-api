import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantIdealJobType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantIdealJobQuery = {
	applicantIdealJob: {
		type: new GraphQLList(ApplicantIdealJobType),
		description: 'List ideal jobs of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantIdealJobs.findAll({ where: args });
		}
	}
};

export default ApplicantIdealJobQuery;
