import { ApplicantW4Type } from '../types/operations/outputTypes';
import { GraphQLInt, GraphQLString } from 'graphql';
import {generatePdfFile} from '../../../Utilities/PdfManagement';
import {uploadToS3} from '../../../Utilities/S3Management';
const fs = require('fs');

const uuidv4 = require('uuid/v4');

import Db from '../../models/models';

const ApplicantW4Mutation = {
	addApplicantW4: {
		type: ApplicantW4Type,
		description: 'Add W4 DocumentType to database',
		args: {
			html: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt },
			json: { type: GraphQLString }
		},
		async resolve(source, args) {
			const identifier = uuidv4();
			let filename = `w4_${identifier}_${args.ApplicationId}`;

			await Db.models.ApplicantW4.destroy({
				where: {
					ApplicationId: args.ApplicationId
				}
			})

			return generatePdfFile(args.html, filename + '.pdf').then(fileFullPath => {
				// Si falla al generar el pdf debe poder guardar el resto de datos
				if(!fileFullPath) return Db.models.ApplicantW4.create({ fieldsData: args.json, fileName: filename, url: null, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });

				return uploadToS3(fileFullPath).then(url => {
					fs.unlinkSync(fileFullPath);
					return Db.models.ApplicantW4.create({ fieldsData: args.json, fileName: filename, url, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
				});
			});
		}
	},
};

export default ApplicantW4Mutation;
