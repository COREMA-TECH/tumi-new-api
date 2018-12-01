import { inputApplicantPhase } from '../types/operations/insertTypes';
import { inputUpdateApplicantPhase } from '../types/operations/updateTypes';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ApplicantPhaseMutation = {

	addApplicantPhase: {
		type: new GraphQLList(ApplicationPhaseType),
		description: 'Add Application Phase to database',
		args: {
			applicationPhases: { type: new GraphQLList(inputApplicantPhase) }
		},
		resolve(source, args) {
			//console.log("Entro aqui");
			//console.log("argumentos ", args.applicationPhases);
			return Db.models.ApplicationPhases.bulkCreate(args.applicationPhases, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateApplicantPhase: {
		type: ApplicationPhaseType,
		description: 'Update Work Order Info',
		args: {
			applicationPhases: { type: inputUpdateApplicantPhase }
		},
		resolve(source, args) {
			return Db.models.ApplicationPhases
				.update(
					{
						UserId: args.applicationPhases.UserId,
						ReasonId: args.applicationPhases.ReasonId,
						ApplicationId: args.applicationPhases.ApplicationId,
						Comment: args.applicationPhases.Comment,
						StageId: args.applicationPhases.StagedId,
						WorkOrderId: args.applicationPhases.WorkOrderId,
					}, {
						where: {
							id: args.workOrder.id
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

export default ApplicantPhaseMutation;
