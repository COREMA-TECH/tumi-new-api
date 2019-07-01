import { inputInsertMarkedEmployees } from '../types/operations/insertTypes';
import { inputUpdateMarkedEmployees } from '../types/operations/updateTypes';
import { MarkedEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import moment from 'moment';

import Db from '../../models/models';

import Sequelize from 'sequelize';
import { ContextualizedQueryLatencyStats } from 'apollo-engine-reporting-protobuf';
const Op = Sequelize.Op;


const MarkedEmployeesMutation = {
	addMarkedEmployees: {
		type: new GraphQLList(MarkedEmployeesType),
		description: 'Add Marked Employees to database',
		args: {
			MarkedEmployees: { type: new GraphQLList(inputInsertMarkedEmployees) }
		},
		resolve(source, args) {
			return Db.models.MarkedEmployees.bulkCreate(args.MarkedEmployees);

		}
		// },
		// actualizarMarcasMasiva: {
		// 	type: new GraphQLList(MarkedEmployeesType),
		// 	description: 'Actualizar de forma masiva las marcadas',
		// 	resolve(source, args) {
		// 		return Db.models.MarkedEmployees.findAll().
		// 			then(_ => {
		// 				let marks = [];
		// 				_.map(_mark => {
		// 					let mark = _mark.dataValues;
		// 					let hours = mark.markedTime.split(' ');
		// 					let _hour = hours[0];
		// 					if (hours[1] == 'PM' && parseInt(hours[0]) != 12)
		// 						_hour = moment(_hour, "hh:mm").add(12, 'hours').format("HH:mm");
		// 					if (_hour.length == 4) _hour = `0${_hour}`;
		// 					marks.push({ id: mark.id, markedTime: _hour })
		// 				})
		// 				marks.map(_arr => {
		// 					return Db.models.MarkedEmployees.update({ markedTime: _arr.markedTime }, { where: { id: _arr.id } })
		// 				})

		// 			})
		// 	}
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
