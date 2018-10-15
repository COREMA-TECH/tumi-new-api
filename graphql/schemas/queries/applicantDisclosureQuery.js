import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantDisclosureType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantDisclosureQuery = {
	applicantDisclosure: {
		type: new GraphQLList(ApplicantDisclosureType),
		description: 'List application disclosure',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantDisclosures.findAll({ where: args });
		}
	}
};

export default ApplicantDisclosureQuery;
