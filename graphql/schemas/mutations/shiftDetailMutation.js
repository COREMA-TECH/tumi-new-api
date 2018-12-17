import { inputInsertShiftDetail } from '../types/operations/insertTypes';
import { inputUpdateShiftDetail } from '../types/operations/updateTypes';
import { ShiftDetailType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const shiftDetailMutation = {
	addShiftDetail: {
		type: new GraphQLList(ShiftDetailType),
		description: 'Add Shift to database',
		args: {
			ShiftDetail: { type: new GraphQLList(inputInsertShiftDetail) }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.bulkCreate(args.ShiftDetail, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateShiftDetail: {
		type: ShiftDetailType,
		description: 'Update Shift Info',
		args: {
			ShiftDetail: { type: inputUpdateShiftDetail }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail
				.update(
					{
						startDate: args.ShiftDetail.startDate,
						endDate: args.ShiftDetail.endDate,
						startTime: args.ShiftDetail.startTime,
						endTime: args.ShiftDetail.endTime,
						ShiftId: args.ShiftDetail.ShiftId
					},
					{
						where: {
							id: args.ShiftDetail.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	deleteShiftDetail: {
		type: GraphQLInt,
		description: 'Delete Shift Details record from database',
		args: {
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.ShiftDetail.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},
};

export default shiftDetailMutation;
