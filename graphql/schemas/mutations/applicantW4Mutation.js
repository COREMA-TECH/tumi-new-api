import { inputInsertApplicantW4 } from '../types/operations/insertTypes';
import { ApplicantW4Type } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import {generatePdfFile} from '../../../Utilities/PdfManagement';
import {uploadToS3} from '../../../Utilities/S3Management';

import pdf from 'html-pdf';
import AWS from 'aws-sdk';
import fs from 'fs';

import Db from '../../models/models';

const ApplicantW4Mutation = {
	addApplicantW4: {
		type: new GraphQLList(ApplicantW4Type),
		description: 'Add W4 DocumentType to database',
		args: {
			html: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt }
		},
		resolve(source, args) {
			let filename = `w4_${args.ApplicationId}`;

			generatePdfFile(args.html, filename + '.pdf').then(fileFullPath => {
				if(!fileFullPath) return this.type;
				uploadToS3(fileFullPath).then(url => {
					if(!url) {
						let path = 'http://localhost:5000' + fileFullPath.replace('.', ''); // solo para prueba local
						return Db.models.ApplicantW4.create({ fileName: filename, url: path, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
					}
					fs.unlinkSync(fileFullPath);
					return Db.models.ApplicantW4.create({ fileName: filename, url, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
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
			// };
			// var filename = `w4_${args.ApplicationId}`;
			// var srcFile = `./public/${filename}.pdf`;

			// pdf.create(args.html, options).toFile(srcFile, function (err, res) {
			// 	if (err) return console.log(err);
			// });

			// return Db.models.ApplicantW4.create({ fileName: filename, url: srcFile, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true }).then((output) => {
			// 	// return output.map((element) => {
			// 	// 	return element.dataValues;
			// 	// });
			// });
		}
	},
};

export default ApplicantW4Mutation;
