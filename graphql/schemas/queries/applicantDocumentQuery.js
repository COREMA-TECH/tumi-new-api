import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantDocumentType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantDocumentQuery = {
	applicantDocument: {
		type: new GraphQLList(ApplicantDocumentType),
		description: 'List application documents',
		args: {
			id: {
				type: GraphQLInt
			},
			CatalogItemId: {
				type: GraphQLInt
			},
			ApplicationId: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.ApplicantDocument.findAll({ where: args });
		}
	}
};

export default ApplicantDocumentQuery;
