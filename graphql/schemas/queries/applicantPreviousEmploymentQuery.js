import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantPreviousEmploymentType } from '../types/operations/outputTypes';
import Db from '../../models/models';

console.log('ApplicantPreviousEmploymentType', ApplicantPreviousEmploymentType);

const ApplicantPreviousEmploymentQuery = {
	applicantPreviousEmployments: {
		type: new GraphQLList(ApplicantPreviousEmploymentType),
		description: 'List previous employments of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantPreviousEmployments.findAll({ where: args });
		}
	}
};

export default ApplicantPreviousEmploymentQuery;
