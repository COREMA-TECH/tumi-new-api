import { inputInsertApplicantDisclosure } from '../types/operations/insertTypes';
import { inputUpdateApplicantDisclosure } from '../types/operations/updateTypes';
import { ApplicantDisclosureType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantDisclosureMutation = {
	addDisclosure: {
		type: new GraphQLList(ApplicantDisclosureType),
		description: 'Add applicant disclosure record to database',
		args: {
			disclosures: { type: new GraphQLList(inputInsertApplicantDisclosure) }
		},
		resolve(source, args) {
			return Db.models.ApplicantDisclosures.bulkCreate(args.disclosures, { returning: true }).then((output) => {
				return output.map((element) => {
					return element.dataValues;
				});
			});
		}
	},
	updateDisclosure: {
		type: ApplicantDisclosureType,
		description: 'Update Applicant Disclosure Record Info',
		args: {
			disclosure: { type: inputUpdateApplicantDisclosure }
		},
		resolve(source, args) {
			// Si se actualiza un campo distinto a pdfUrl lo setea a null para poder generar un nuevo pdf
			let disclosure = args.disclosure.pdfUrl ? args.disclosure : { ...args.disclosure, pdfUrl: null};
			return Db.models.ApplicantDisclosures
				.update(
					{
						...disclosure
						// TODO: (LF) Quitar codigo comentado
						// signature: args.disclosure.signature,
						// content: args.disclosure.content,
						// date: args.disclosure.date,
						// applicantName: args.disclosure.applicantName,
						// ApplicationId: args.disclosure.ApplicationId,
						// completed: args.disclosure.completed
					},
					{
						where: {
							id: args.disclosure.id
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

export default ApplicantDisclosureMutation;
