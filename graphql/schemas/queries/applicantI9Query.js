import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantI9Type } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantI9Query = {
	applicantI9: {
		type: new GraphQLList(ApplicantI9Type),
		description: 'List application w4',
		args: {
			id: {
				type: GraphQLInt
			},
			ApplicationId: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantI9.findAll({
				where: args,
				order: [ [ 'id', 'DESC' ] ]
			});
		}
	}
};

export default ApplicantI9Query;
