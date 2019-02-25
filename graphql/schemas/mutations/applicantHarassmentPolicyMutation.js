import { inputInsertApplicantHarassmentPolicy } from '../types/operations/insertTypes';
import { inputUpdateApplicantHarassmentPolicy } from '../types/operations/updateTypes';
import { ApplicantHarassmentPolicyType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantHarassmentPolicyMutation = {
	addHarassmentPolicy: {
		type: new GraphQLList(ApplicantHarassmentPolicyType),
		description: 'Add applicant harassment policy record to database',
		args: {
			harassmentPolicy: { type: new GraphQLList(inputInsertApplicantHarassmentPolicy) }
		},
		resolve(source, args) {
			return Db.models.ApplicantHarassmentPolicy
				.bulkCreate(args.harassmentPolicy, { returning: true })
				.then((output) => {
					return output.map((element) => {
						return element.dataValues;
					});
				});
		}
	},
	updateHarassmentPolicy: {
		type: ApplicantHarassmentPolicyType,
		description: 'Update Applicant Background Check Record Info',
		args: {
			harassmentPolicy: { type: inputUpdateApplicantHarassmentPolicy }
		},
		resolve(source, args) {
			return Db.models.ApplicantHarassmentPolicy
				.update(
					{
						companyPhoneNumber: args.harassmentPolicy.companyPhoneNumber,
						signature: args.harassmentPolicy.signature,
						content: args.harassmentPolicy.content,
						date: args.harassmentPolicy.date,
						applicantName: args.harassmentPolicy.applicantName,
						ApplicationId: args.harassmentPolicy.ApplicationId,
						completed: args.harassmentPolicy.completed
					},
					{
						where: {
							id: args.harassmentPolicy.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ApplicantHarassmentPolicyMutation;
