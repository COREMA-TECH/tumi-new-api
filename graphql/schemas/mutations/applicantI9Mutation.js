import { ApplicantI9Type } from '../types/operations/outputTypes';
import { GraphQLInt, GraphQLString } from 'graphql';
import {generatePdfFile} from '../../../Utilities/PdfManagement';
import {uploadToS3} from '../../../Utilities/S3Management';

const uuidv4 = require('uuid/v4');

import Db from '../../models/models';

const ApplicantI9Mutation = {
	addApplicantI9: {
		type: ApplicantI9Type,
		description: 'Add I9 DocumentType to database',
		args: {
			html: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt },
			json: { type: GraphQLString }
		},
		async resolve(source, args) {
			const identifier = uuidv4();
			let filename = `i9_${identifier}_${args.ApplicationId}`;

			await Db.models.ApplicantI9.destroy({
				where: {
					ApplicationId: args.ApplicationId
				}
			});

			return generatePdfFile(args.html, filename + '.pdf').then(fileFullPath => {
				// Si falla al generar el pdf debe poder guardar el resto de datos
				if(!fileFullPath) return Db.models.ApplicantI9.create({ fieldsData: args.json, fileName: filename, url: null, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });

				return uploadToS3(fileFullPath).then(url =>{
					fs.unlinkSync(fileFullPath);
					return Db.models.ApplicantI9.create({ fieldsData: args.json, fileName: filename, url, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html }, { returning: true });
				});
			});
		}
	},
};

export default ApplicantI9Mutation;
