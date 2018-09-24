import { inputInsertApplicantMilitaryService } from '../types/operations/insertTypes';
import { inputUpdateApplicantMilitaryService } from '../types/operations/updateTypes';
import { ApplicantMilitaryServiceType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantMilitaryServiceMutation = {
	addMilitaryService: {
		type: ApplicantMilitaryServiceType,
		description: 'Add applicant military service record to database',
		args: {
			militaryService: { type: inputInsertApplicantMilitaryService }
		},
		resolve(source, args) {
			return Db.models.ApplicantMilitaryServices.create({
				branch: args.ApplicantMilitaryServices.branch,
				startDate: args.ApplicantMilitaryServices.startDate,
				endDate: args.ApplicantMilitaryServices.endDate,
				rankAtDischarge: args.ApplicantMilitaryServices.rankAtDischarge,
				typeOfDischarge: args.ApplicantMilitaryServices.typeOfDischarge,
				ApplicationId: args.ApplicantMilitaryServices.ApplicationId
			});
		}
	},
	updateApplicantLanguage: {
		type: ApplicantMilitaryServiceType,
		description: 'Update Applicant Military Service Record Info',
		args: {
			militaryService: { type: inputUpdateApplicantMilitaryService }
		},
		resolve(source, args) {
			return Db.models.ApplicantMilitaryServices
				.update(
					{
						branch: args.ApplicantMilitaryServices.branch,
						startDate: args.ApplicantMilitaryServices.startDate,
						endDate: args.ApplicantMilitaryServices.endDate,
						rankAtDischarge: args.ApplicantMilitaryServices.rankAtDischarge,
						typeOfDischarge: args.ApplicantMilitaryServices.typeOfDischarge,
						ApplicationId: args.ApplicantMilitaryServices.ApplicationId
					},
					{
						where: {
							id: args.ApplicantMilitaryServices.id
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

export default ApplicantMilitaryServiceMutation;
