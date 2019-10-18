import { GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
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
			return await Db.models.ApplicantLegalDocument.findAll({ 
				where: args,
				order: [['createdAt', 'DESC']],
				include: [{
					model: Db.models.Users,
					required: true
				},{
					model: Db.models.ApplicationDocumentType,
					required: true
				}]
			});
		}
	},
	lastApplicantLegalDocument: {
		type: ApplicantLegalDocumentType,
		description: 'last Applicant Documents',
		args: {
			ApplicationDocumentTypeId: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'User Id'
			},
			ApplicationId: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Application Id'
			}
		},
		async resolve(root, args) {
			return await Db.models.ApplicantLegalDocument.findOne({ 
				where: args,
				order: [['createdAt', 'DESC']],
				include: [{
					model: Db.models.Users,
					required: true
				},{
					model: Db.models.ApplicationDocumentType,
					required: true
				}]
			});
		}
	}
};

export default ApplicantLegalDocumentsQuery;