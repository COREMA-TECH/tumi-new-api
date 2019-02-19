import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantW4Type } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantW4Query = {
	applicantW4: {
		type: new GraphQLList(ApplicantW4Type),
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
			return Db.models.ApplicantW4.findAll({
				where: args,
				order: [ [ 'id', 'DESC' ] ]
			});
		}
	}
};

export default ApplicantW4Query;
