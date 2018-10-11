import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantWorkerCompensationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantWorkerCompensationQuery = {
	applicantWorkerCompensation: {
		type: new GraphQLList(ApplicantWorkerCompensationType),
		description: 'Get the list of Application Worker Compensation',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantWorkerCompensation.findAll({ where: args });
		}
	}
};

export default ApplicantWorkerCompensationQuery;
