import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantLanguageType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantLanguageQuery = {
	applicantLanguages: {
		type: new GraphQLList(ApplicantLanguageType),
		description: 'List languages of applicant',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantLanguages.findAll({ where: args });
		}
	}
};

export default ApplicantLanguageQuery;
