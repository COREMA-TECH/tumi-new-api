import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';
import { outputType } from './applicationType';
import Db from '../../models/models';

const ApplicationQuery = {
	applications: {
		type: new GraphQLList(outputType),
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
