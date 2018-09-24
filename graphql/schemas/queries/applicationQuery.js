import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { ApplicationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicationQuery = {
	applications: {
		type: new GraphQLList(ApplicationType),
		description: 'List applications records',
		args: {
			id: {
				type: GraphQLInt
			},
			firstName: {
				type: GraphQLString
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findAll({ where: args });
		}
	}
};

export default ApplicationQuery;
