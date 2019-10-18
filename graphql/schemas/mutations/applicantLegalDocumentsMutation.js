import { inputInsertApplicantLegalDocuments } from '../types/operations/insertTypes';
import { inputUpdateApplicantLegalDocuments } from '../types/operations/updateTypes';
import { ApplicantLegalDocumentType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import {generatePdfFile} from '../../../Utilities/PdfManagement';
import {uploadToS3} from '../../../Utilities/S3Management';

import Db from '../../models/models';
const fs = require('fs');

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
	newApplicantLegalDocument: {
		type: ApplicantLegalDocumentType,
		description: 'Add a applicant legal document',
		args: {
			fileName: { type: GraphQLString },
			html: { type: GraphQLString },
			applicantLegalDocument: { type: inputInsertApplicantLegalDocuments }
		},
		resolve(source, args) {
			let {applicantLegalDocument} = args;
			const saveData = () => {
				return Db.models.ApplicantLegalDocument
					.create(applicantLegalDocument, { returning: true }).then(result => {
						return result.dataValues;
					});
			}

			try {
				if(args.html){
					const name = args.fileName || '';
					const content = args.html;
					return generatePdfFile(content, name.trim() + '.pdf').then(fileFullPath => {
						if(!fileFullPath) return null;
						
						return uploadToS3(fileFullPath).then(url => {
							fs.unlinkSync(fileFullPath);
							applicantLegalDocument = {...applicantLegalDocument, url};
							return saveData();
						});
					});
				}
				else return saveData();

			} catch (err) {
				console.log('Database ' + err);
				return null;
			}
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
