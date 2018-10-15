import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantConductCodeType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantConductCodeQuery = {
	applicantConductCode: {
		type: new GraphQLList(ApplicantConductCodeType),
		description: 'List application code of conduct',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantConductCodes.findAll({ where: args });
		}
	}
};

export default ApplicantConductCodeQuery;
