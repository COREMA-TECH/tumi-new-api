import { inputInsertApplicantPreviousEmployment } from '../types/operations/insertTypes';
import { inputUpdateApplicantPreviousEmployment } from '../types/operations/updateTypes';
import { ApplicantPreviousEmploymentType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';
import Db from '../../models/models';

const ApplicantPreviousEmploymentMutation = {
	/*	addApplicantPreviousEmployment: {
		type: ApplicantPreviousEmploymentType,
		description: 'Add applicant previous employment record to database',
		args: {
			applicantPreviousEmployment: { type: inputInsertApplicantPreviousEmployment }
		},
		resolve(source, args) {
			return Db.models.ApplicantPreviousEmployments.create({
				ApplicationId: args.applicantPreviousEmployment.ApplicationId,
				companyName: args.applicantPreviousEmployment.language,
				phone: args.applicantPreviousEmployment.writing,
				address: args.applicantPreviousEmployment.conversation,
				supervisor: args.applicantPreviousEmployment.language,
				jobTitle: args.applicantPreviousEmployment.writing,
				payRate: args.applicantPreviousEmployment.conversation,
				startDate: args.applicantPreviousEmployment.writing,
				endDate: args.applicantPreviousEmployment.conversation,
				reasonForLeaving: args.applicantPreviousEmployment.writing
			});
		}
	},*/
	updateApplicantPreviousEmployment: {
		type: ApplicantPreviousEmploymentType,
		description: 'Update Applicant previous employment Record Info',
		args: {
			applicantPreviousEmployment: { type: inputUpdateApplicantPreviousEmployment }
		},
		resolve(source, args) {
			return Db.models.ApplicantPreviousEmployments
				.update(
					{
						ApplicationId: args.applicantPreviousEmployment.ApplicationId,
						companyName: args.applicantPreviousEmployment.companyName,
						phone: args.applicantPreviousEmployment.phone,
						address: args.applicantPreviousEmployment.address,
						supervisor: args.applicantPreviousEmployment.supervisor,
						jobTitle: args.applicantPreviousEmployment.jobTitle,
						payRate: args.applicantPreviousEmployment.payRate,
						startDate: args.applicantPreviousEmployment.startDate,
						endDate: args.applicantPreviousEmployment.endDate,
						reasonForLeaving: args.applicantPreviousEmployment.reasonForLeaving
					},
					{
						where: {
							id: args.applicantPreviousEmployment.id
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
	addApplicantPreviousEmployment: {
		type: new GraphQLList(ApplicantPreviousEmploymentType),
		description: 'Add applicant previous employment record to database',
		args: {
			applicantPreviousEmployment: { type: new GraphQLList(inputInsertApplicantPreviousEmployment) }
		},
		resolve(source, args) {
			return Db.models.ApplicantPreviousEmployments
				.bulkCreate(args.applicantPreviousEmployment, { returning: true })
				.then((previousEmployments) => {
					return previousEmployments.map((prevEmp) => {
						return prevEmp.dataValues;
					});
				});
		}
	}
};

export default ApplicantPreviousEmploymentMutation;
