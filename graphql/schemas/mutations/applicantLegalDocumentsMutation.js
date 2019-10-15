import { inputInsertApplicantLegalDocuments } from '../types/operations/insertTypes';
import { inputUpdateApplicantLegalDocuments } from '../types/operations/updateTypes';
import { ApplicantLegalDocumentType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantLegalDocumentsMutation = {
	addApplicantLegalDocuments: {
		type: new GraphQLList(ApplicantLegalDocumentType),
		description: 'Add applicant legal documents',
		args: {
			applicantLegalDocuments: { type: new GraphQLList(inputInsertApplicantLegalDocuments) }
		},
		resolve(source, args) {
			return Db.models.ApplicantLegalDocument
				.bulkCreate(args.applicantLegalDocuments, { returning: true })
				.then((applicantLegalDocuments) => {
					return applicantLegalDocuments.map((item) => {
						return item.dataValues;
					});
				});
		}
	},
	updateApplicantLegalDocument: {
		type: ApplicantLegalDocumentType,
		description: 'Update Applicant legal document',
		args: {
			applicantLegalDocument: { type: inputUpdateApplicantLegalDocuments }
		},
		resolve(source, args) {
			return Db.models.ApplicantLegalDocument
				.update(args.applicantLegalDocument,
					{
						where: {
							id: args.applicantLegalDocument.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ApplicantLegalDocumentsMutation;
