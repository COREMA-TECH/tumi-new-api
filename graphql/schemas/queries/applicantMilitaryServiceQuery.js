import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantMilitaryServiceType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantMilitaryServiceQuery = {
	applicantMilitaryService: {
		type: new GraphQLList(ApplicantMilitaryServiceType),
		description: 'List military services of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantMilitaryServices.findAll({ where: args });
		}
	}
};

export default ApplicantMilitaryServiceQuery;
