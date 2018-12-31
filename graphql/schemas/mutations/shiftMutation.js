import { inputInsertShift } from '../types/operations/insertTypes';
import { inputUpdateShift } from '../types/operations/updateTypes';
import { ShiftType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import { sendgenericemail } from '../../../Configuration/Roots';

import Db from '../../models/models';

const ShiftMutation = {
	addShift: {
		type: new GraphQLList(ShiftType),
		description: 'Add Shift to database',
		args: {
			Shift: { type: new GraphQLList(inputInsertShift) }
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
	updateShift: {
		type: ShiftType,
		description: 'Update Shift Info',
		args: {
			Shift: { type: inputUpdateShift }
		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					{
						entityId: args.Shift.entityId,
						title: args.Shift.title,
						color: args.Shift.color,
						status: args.Shift.status,
						idPosition: args.Shift.idPosition
					},
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
	},
	destroyShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Shift.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	},
	deleteShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					{
						status: 0
					},
					{
						where: {
							id: args.id
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
	changeStatusShift: {
		type: ShiftType,
		description: 'Delete Shift record from database',
		args: {
			id: { type: GraphQLInt },
			status: { type: GraphQLInt },
			color: { type: GraphQLString }


		},
		resolve(source, args) {
			return Db.models.Shift
				.update(
					{
						status: args.status,
						color: args.color
					},
					{
						where: {
							id: args.id
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

export default ShiftMutation;
