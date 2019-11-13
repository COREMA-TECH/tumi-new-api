import { inputInsertHiredState } from '../types/operations/insertTypes';
import { HiredStateType } from '../types/operations/outputTypes';
import { inputUpdateHiredState } from '../types/operations/updateTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const HiredStateMutation = {
	addHiredState: {
		type: new GraphQLList(HiredStateType),
		description: 'Add HiredState to database',
		args: {
			hiredStates: { type: new GraphQLList(inputInsertHiredState) }
		},
		resolve(source, args) {
			return Db.models.HiredStates.bulkCreate(args.hiredStates, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateHiredState : {
		type: HiredStateType,
		description: 'Update HiredState',
		args: {
			hiredState: { type: inputUpdateHiredState }
		},
		resolve(source, args) {
			const { Id, First_Name, Last_Name, Electronic_Address, Phone_Number } = args.contact;
			return Db.models.HiredStates
				.update(args.hiredState,
					{
						where: { id: args.hiredState.id },
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

export default HiredStateMutation;
