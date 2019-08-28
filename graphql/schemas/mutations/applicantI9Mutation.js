import { inputInsertApplicantW4 } from '../types/operations/insertTypes';
import { ApplicantI9Type } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import {generatePdfFile} from '../../../Utilities/PdfManagement';
import {uploadToS3} from '../../../Utilities/S3Management';

import pdf from 'html-pdf';
import AWS from 'aws-sdk';
import fs from 'fs';

import Db from '../../models/models';

const ApplicantI9Mutation = {
	addApplicantI9: {
		type: ApplicantI9Type,
		description: 'Add I9 DocumentType to database',
		args: {
			html: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt }
		},
		resolve(source, args) {
			let filename = `i9_${args.ApplicationId}`;

			return generatePdfFile(args.html, filename + '.pdf').then(fileFullPath => {
				if(!fileFullPath) return this.type;

				return uploadToS3(fileFullPath).then(url =>{
					if(!url) {
						let path = 'http://localhost:5000' + fileFullPath.replace('.', ''); // solo para prueba local
						return Db.models.ApplicantI9.create({ fileName: filename, url: path, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
					}
					fs.unlinkSync(fileFullPath);
					return Db.models.ApplicantI9.create({ fileName: filename, url, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
				});
			});

			// TODO: (LF) Quitar codigo comentado
            // //aqui va la logica del PDF
			// var options = {
			// 	format: 'Letter',
			// 	font: 'Arial',
			// 	size: 12,
			// 	type: "pdf",             // allowed file types: png, jpeg, pdf
			// 	quality: "75",           // only used for types png & jpeg
			// 	orientation: 'portrait',
			// 	zoomFactor: 1,
			// 	border: {
			// 		top: '0.98in', // default is 0, units: mm, cm, in, px
			// 		right: '0.98in',
			// 		bottom: '0.98in',
			// 		left: '0.98in'
			// 	}
			// }

			// var filename = `i9_${args.ApplicationId}`;
			// var srcFile = `./public/${filename}.pdf`;

			// pdf.create(args.html, options).toFile(srcFile, function (err, res) {
			// 	if (err) console.log(err);
			// 	console.log(res);
			// });

			// return Db.models.ApplicantI9.create({ fileName: filename, url: srcFile, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true }).then((output) => {
			// 	// return output.map((element) => {
			// 	// 	return element.dataValues;
			// 	// });
			// });
		}
	},
};

export default ApplicantI9Mutation;
