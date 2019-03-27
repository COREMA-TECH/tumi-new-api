import { inputInsertShift, filterShiftConvertToOpening, filterShiftWOConvertToOpening, inputApplicantPhase } from '../types/operations/insertTypes';
import { inputUpdateShift } from '../types/operations/updateTypes';
import { ShiftType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';
import { sendworkorderfilledemail } from '../../../Configuration/Roots';
import GraphQLDate from 'graphql-date';

import Sequelize from 'sequelize';
const Op = Sequelize.Op;


import Db from '../../models/models';

const OpeningRecruiterMutation = {
	addOpeningRecruiter: {
		type: new GraphQLList(ShiftType),
		description: 'Add OpeningRecruiter',
		args: {
			recruiterId: {
				type: GraphQLInt
			},
			openingId: {
				type: GraphQLInt
			}
		},
		resolve(source, args) {
			return Db.models.Shift.bulkCreate(args.Shift, { returning: true }).then((ret) => {
				return ret.map((data) => {
					//	sendgenericemail({ shift: datashift.dataValues.id, email: "mppomar@gmail.com", title: "New Shift publish" })


					return data.dataValues;
				});
			});
		}
	},
	updateOpeningRecruiter: {
		type: ShiftType,
		description: 'Update OpeningRecruiter',
		args: {
			Shift: { type: inputUpdateShift }
		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					args.Shift,
					{
						where: {
							id: args.Shift.id
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

export default OpeningRecruiterMutation;
