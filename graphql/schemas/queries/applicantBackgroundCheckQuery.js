import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantBackgroundCheckType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantBackgroundCheckQuery = {
	applicantBackgroundCheck: {
		type: new GraphQLList(ApplicantBackgroundCheckType),
		description: 'Get the list of Application Background Check',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantBackgroundChecks.findAll({ where: args });
		}
	}
};

export default ApplicantBackgroundCheckQuery;
