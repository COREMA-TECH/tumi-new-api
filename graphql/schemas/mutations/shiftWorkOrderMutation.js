import { inputInsertShiftWorkOrder } from '../types/operations/insertTypes';
import { inputUpdateShift } from '../types/operations/updateTypes';
import { ShiftWorkOrderType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const ShiftWorkOrderMutation = {
	addShiftWorkOrder: {
		type: new GraphQLList(ShiftWorkOrderType),
		description: 'Add Shift to database',
		args: {
			ShiftWorkOrder: { type: new GraphQLList(inputInsertShiftWorkOrder) }
		},
		resolve(source, args) {
			return Db.models.ShiftWorkOrder.bulkCreate(args.ShiftWorkOrder, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	}
};

export default ShiftWorkOrderMutation;
