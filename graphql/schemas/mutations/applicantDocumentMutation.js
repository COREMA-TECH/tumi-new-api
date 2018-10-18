import { inputInsertApplicantDocument } from '../types/operations/insertTypes';
import { inputUpdateApplicantDocument } from '../types/operations/updateTypes';
import { ApplicantDocumentType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantDocumentMutation = {
	addApplicantDocument: {
		type: new GraphQLList(ApplicantDocumentType),
		description: 'Add applicant documents to database',
		args: {
			documents: { type: new GraphQLList(inputInsertApplicantDocument) }
		},
		resolve(source, args) {
			return Db.models.ApplicantDocument.bulkCreate(args.documents, { returning: true }).then((output) => {
				return output.map((element) => {
					return element.dataValues;
				});
			});
		}
	},
	updateApplicantDocument: {
		type: ApplicantDocumentType,
		description: 'Update Application Document Record Info',
		args: {
			document: { type: inputUpdateApplicantDocument }
		},
		resolve(source, args) {
			return Db.models.ApplicantDocument
				.update(
					{
						url: args.document.url,
						CatalogItemId: args.document.CatalogItemId,
						ApplicationId: args.document.ApplicationId
					},
					{
						where: {
							id: args.document.id
						},
						returning: true
					}
				)
				.then(function([ rowsUpdate, [ record ] ]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	deleteApplicantDocument: {
		type: GraphQLInt,
		description: 'Delete applicant document record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ApplicantDocument.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default ApplicantDocumentMutation;
