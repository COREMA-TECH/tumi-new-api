import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { ApplicationDocumentTypeType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicationDocumentTypeQuery = {
	applicationDocumentTypes: {
		type: new GraphQLList(ApplicationDocumentTypeType),
		description: 'List Application Document Type',
		args: {
			id: {
				type: GraphQLInt
			},
			name: {
				type: GraphQLString,
				description: 'Document Name'
			},
			description: {
				type: GraphQLString,
				description: 'Document Description'
			}
		},
		resolve(root, args) {
			return Db.models.ApplicationDocumentType.findAll({ where: args, order: [['name', 'ASC']] });
		}
	}
};

export default ApplicationDocumentTypeQuery;