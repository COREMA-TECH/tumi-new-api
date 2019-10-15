import { GraphQLInt, GraphQLList } from 'graphql';
import { inputUpdateApplicantLegalDocuments } from '../types/operations/updateTypes';
import { ApplicantLegalDocumentType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantLegalDocumentsQuery = {
	applicantLegalDocuments: {
		type: new GraphQLList(ApplicantLegalDocumentType),
		description: 'List Applicant Documents',
		args: {
            applicantLegalDocument: { type: inputUpdateApplicantLegalDocuments }
		},
		resolve(root, args) {
			return Db.models.ApplicantLegalDocument.findAll({ where: args.applicantLegalDocument });
		}
	}
};

export default ApplicantLegalDocumentsQuery;