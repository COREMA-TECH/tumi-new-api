import { inputInsertMarkedEmployees } from '../types/operations/insertTypes';
import { inputUpdateMarkedEmployees } from '../types/operations/updateTypes';
import { MarkedEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const MarkedEmployeesMutation = {
	addMarkedEmployees: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Add Marked Employees to database',
		args: {
			MarkedEmployees: { type: new GraphQLList(inputInsertMarkedEmployees) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees.bulkCreate(args.MarkedEmployees, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateMarkedEmployees: {
		type: MarkedEmployeesType,
		description: 'Update Marked Employees Info',
		args: {
			markedemployees: { type: inputUpdateMarkedEmployees }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees
				.update(
					{
						entityId: args.markedemployees.entityId,
						typeMarkedId: args.markedemployees.typeMarkedId,
						markedDate: args.markedemployees.markedDate,
						markedTime: args.markedemployees.markedTime,
						imageMarked: args.markedemployees.imageMarked,
					},
					{
						where: {
							id: args.markedemployees.id
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

export default MarkedEmployeesMutation;
