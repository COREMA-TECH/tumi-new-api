import { inputInsertMarkedEmployees } from '../types/operations/insertTypes';
import { inputUpdateMarkedEmployees } from '../types/operations/updateTypes';
import { MarkedEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

import Sequelize from 'sequelize';
const Op = Sequelize.Op;


const MarkedEmployeesMutation = {
	addMarkedEmployees: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Add Marked Employees to database',
		args: {
			MarkedEmployees: { type: new GraphQLList(inputInsertMarkedEmployees) }
		},
		resolve(source, args) {
			return args.MarkedEmployees.map(mark => {
				return Db.models.ShiftDetailEmployees.findOne(
					{
						include: [{
							model: Db.models.ShiftDetail,
							where: {
								startTime: { [Op.lte]: mark.markedTime },
								endTime: { [Op.gte]: mark.markedTime }
							}
						}, {
							model: Db.models.Employees,
							where: { idEntity: mark.entityId, id: mark.EmployeeId }
						}]
					}
				).then(_uniqueMark => {
					var shiftDetail = null, ShiftId = null;
					//Insert mark without associatedshift
					if (_uniqueMark) {
						shiftDetail = _uniqueMark.dataValues.ShiftDetail.dataValues;
						ShiftId = shiftDetail.ShiftId;
					}

					return Db.models.MarkedEmployees.create({ ...mark, ShiftId });
				}).catch(error => { console.log(error); })
			})

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
				.update(args.markedemployees,
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
