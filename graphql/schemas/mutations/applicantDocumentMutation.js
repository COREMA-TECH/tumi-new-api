import { inputInsertApplicantDocument } from '../types/operations/insertTypes';
import { inputUpdateApplicantDocument } from '../types/operations/updateTypes';
import { ApplicantDocumentType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import pdf from 'html-pdf';
import AWS from 'aws-sdk';
import fs from 'fs';

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
	addApplicantDocumentPDF: {
		type: new GraphQLList(ApplicantDocumentType),
		description: 'Add applicant documents to database',
		args: {
			html: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt },
			documentType: { type: GraphQLString }
		},
		resolve(source, args) {
			//aqui va la logica del PDF
			var options = {
				format: 'Letter',
				font: 'Arial',
				size: 12,
				type: "pdf",             // allowed file types: png, jpeg, pdf
				quality: "75",           // only used for types png & jpeg
				orientation: 'portrait',
				zoomFactor: 1,
				border: {
					top: '0.98in', // default is 0, units: mm, cm, in, px
					right: '0.98in',
					bottom: '0.98in',
					left: '0.98in'
				}
			};
			var filename = `${args.documentType}_${args.ApplicationId}`;
			var srcFile = `./public/${filename}.pdf`;

			AWS.config.update({
				accessKeyId: "AKIAJKPVCC36B44OOXJA",
				secretAccessKey: "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"
			});

			//aqui va la logica de S3
			var s3 = new AWS.S3();
			var filePath = srcFile;

			var params = {
				Bucket: 'imagestumi',
				Body : fs.createReadStream(filePath),
				Key : "PDF/" + path.basename(filePath)
			};

			s3.upload(params, function (err, data) {
				//handle error
				if (err) {
					console.log("Error", err);
				}
				//success
				if (data) {
					console.log("Uploaded in:", data.Location);
				}
			});

			pdf.create(args.html, options).toFile(srcFile, function (err, res) {
				if (err) return console.log(err);
			});

			return Db.models.ApplicantDocument.create({ fileName: filename, url: srcFile, fileExtension: ".pdf", ApplicationId: args.ApplicationId }, { returning: true }).then((output) => {
				// return output.map((element) => {
				// 	return element.dataValues;
				// });
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
						fileName: args.document.fileName,
						fileExtension: args.document.fileExtension,
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
				.then(function ([rowsUpdate, [record]]) {
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
