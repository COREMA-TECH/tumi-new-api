import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantHarassmentPolicyType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantHarassmentPolicyQuery = {
	applicantHarassmentPolicy: {
		type: new GraphQLList(ApplicantHarassmentPolicyType),
		description: 'Get the list of Application Harassment Policy',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantHarassmentPolicy.findAll({ where: args });
		}
	}
};

export default ApplicantHarassmentPolicyQuery;
