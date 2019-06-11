import { inputInsertEmployees } from '../types/operations/insertTypes';
import { inputUpdateEmployees } from '../types/operations/updateTypes';
import { EmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean,GraphQLString } from 'graphql';
import moment from 'moment-timezone';

import Db from '../../models/models';

const EmployeesMutation = {
	addEmployees: {
		type: new GraphQLList(EmployeesType),
		description: 'Add Employees to database',
		args: {
			Employees: { type: new GraphQLList(inputInsertEmployees) },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.Employees.bulkCreate(args.Employees, { returning: true }).then((ret) => {

				var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');

						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'CREATED ROW',
							affectedObject: 'EMPLOYEES'
							});

				return ret.dataValues;
			});
		}
	},
	updateEmployees: {
		type: EmployeesType,
		description: 'Update Employees Info',
		args: {
			employees: { type: inputUpdateEmployees },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			return Db.models.Employees
				.update(args.employees,
					{
						where: {
							id: args.employees.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record)
					{
						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'UPDATED ROW',
							affectedObject: 'EMPLOYEES'
							});
						
						return record.dataValues;

					} 
					else return null;
				});
		}
	},
	deleteEmployees: {
		type: EmployeesType,
		description: 'Delete employees record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString }
		},
		resolve(source, args) {
			console.log("argumentos ", args)
			return Db.models.Employees
				.update(
					{
						isActive: false
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) {

						var userdate = new Date();
						var timezone = userdate.getTimezoneOffset();
						var serverdate = new Date(userdate.setMinutes(userdate.getMinutes()+parseInt(timezone)));
						serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');
						Db.models.TransactionLogs.create({
							codeUser: args.codeuser,
							nameUser: args.nameUser,
							actionDate: serverdate,
							action: 'DELETED ROW',
							affectedObject: 'EMPLOYEES'
							});

						return record.dataValues;
					}
					else return null;
				});
		}
	}
};

export default EmployeesMutation;
