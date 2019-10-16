import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { ApplicantLegalDocumentType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantLegalDocumentsQuery = {
	applicantLegalDocuments: {
		type: new GraphQLList(ApplicantLegalDocumentType),
		description: 'List Applicant Documents',
		args: {
			id: {
				type: GraphQLInt
			},
			userId: {
				type: GraphQLInt,
				description: 'User Id'
			},
			ApplicationDocumentTypeId: {
				type: GraphQLInt,
				description: 'User Id'
			},
			ApplicationId: {
				type: GraphQLInt,
				description: 'Application Id'
			},
			completed: {
				type: GraphQLBoolean,
				description: 'completed'
			}
		},
		async resolve(root, args) {
			const temp = await Db.models.ApplicantLegalDocument.findAll({ 
				where: args,
				include: [{
					model: Db.models.ApplicationDocumentType,
					required: true
				}]
			});

			console.log('temporal --- ', temp);
			return temp;
		}
	}
};

export default ApplicantLegalDocumentsQuery;