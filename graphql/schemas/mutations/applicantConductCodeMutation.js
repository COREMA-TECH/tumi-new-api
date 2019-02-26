import { inputInsertApplicantConductCode } from '../types/operations/insertTypes';
import { inputUpdateApplicantConductCode } from '../types/operations/updateTypes';
import { ApplicantConductCodeType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantConductCodeMutation = {
	addConductCode: {
		type: new GraphQLList(ApplicantConductCodeType),
		description: 'Add applicant code of conduct record to database',
		args: {
			conductCode: { type: new GraphQLList(inputInsertApplicantConductCode) }
		},
		resolve(source, args) {
			return Db.models.ApplicantConductCodes.bulkCreate(args.conductCode, { returning: true }).then((output) => {
				return output.map((element) => {
					return element.dataValues;
				});
			});
		}
	},
	updateConductCode: {
		type: ApplicantConductCodeType,
		description: 'Update Applicant Code of Conduct Record Info',
		args: {
			conductCode: { type: inputUpdateApplicantConductCode }
		},
		resolve(source, args) {
			return Db.models.ApplicantConductCodes
				.update(
					{
						signature: args.conductCode.signature,
						content: args.conductCode.content,
						date: args.conductCode.date,
						applicantName: args.conductCode.applicantName,
						ApplicationId: args.conductCode.ApplicationId,
						completed: args.conductCode.completed
					},
					{
						where: {
							id: args.conductCode.id
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

export default ApplicantConductCodeMutation;
