import { inputInsertApplicantMilitaryService } from '../types/operations/insertTypes';
import { inputUpdateApplicantMilitaryService } from '../types/operations/updateTypes';
import { ApplicantMilitaryServiceType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantMilitaryServiceMutation = {
	addMilitaryService: {
		type: new GraphQLList(ApplicantMilitaryServiceType),
		description: 'Add applicant military service record to database',
		args: {
			militaryService: { type: new GraphQLList(inputInsertApplicantMilitaryService) }
		},
		resolve(source, args) {
			return Db.models.ApplicantMilitaryServices
				.bulkCreate(args.militaryService, { returning: true })
				.then((militaryServices) => {
					return militaryServices.map((milService) => {
						return milService.dataValues;
					});
				});
		}
	},
	updateMilitaryService: {
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
	},
	deleteApplicantMilitaryService: {
		type: GraphQLInt,
		description: 'Delete applicant military service record from database',
		args: {
			id: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.ApplicantMilitaryServices.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default ApplicantMilitaryServiceMutation;
