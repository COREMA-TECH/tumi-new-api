import { GraphQLInt, GraphQLList } from 'graphql';
import { applicantLanguageType } from './applicantLanguageType';
import Db from '../../models/models';

const ApplicantLanguageQuery = {
	applicantLanguages: {
		type: new GraphQLList(applicantLanguageType),
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
