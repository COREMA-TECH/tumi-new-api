import { inputInsertEmployees } from '../types/operations/insertTypes';
import { inputUpdateEmployees } from '../types/operations/updateTypes';
import { EmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import moment from 'moment-timezone';

import Db from '../../models/models';

const insertAuditLog = ({ codeuser, nameUser, action, object }) => {
	var userdate = new Date();
	var timezone = userdate.getTimezoneOffset();
	var serverdate = new Date(userdate.setMinutes(userdate.getMinutes() + parseInt(timezone)));
	serverdate = moment().tz('America/Chicago').format('YYYY-MM-DD HH:mm');
	Db.models.TransactionLogs.create({
		codeUser: codeuser,
		nameUser: nameUser,
		actionDate: serverdate,
		action,
		affectedObject: object
	});
}

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

				ret.map(r => {
					if (args.codeuser) {
						let { codeuser, nameUser } = args;
						insertAuditLog({ codeuser, nameUser, action: 'CREATED ROW', object: 'EMPLOYEES' })
					}
				});

				return ret.dataValues;
			});
		}
	},
	createEmployeeBasedOnApplicationOrUpdateEmployee: {
		type: EmployeesType,
		description: 'Create employee based on Application if employee record doesnt exist or Update if employee record exists',
		args: {
			id: { type: GraphQLInt },
			hireDate: { type: GraphQLString },
			startDate: { type: GraphQLString },
			codeuser: { type: GraphQLInt },
			nameUser: { type: GraphQLString },
			ApplicationId: { type: GraphQLInt }
		},
		resolve(source, args) {
			//Update Employee
			if (args.id) {
				let { hireDate, startDate, id } = args;
				console.log({ hireDate, startDate })
				return Db.models.Employees
					.update({ hireDate: hireDate, startDate: startDate }, { where: { id }, returning: true })
					.then(function ([rowsUpdate, [record]]) {
						if (record) {
							if (args.codeuser) {
								let { codeuser, nameUser } = args;
								insertAuditLog({ codeuser, nameUser, action: 'UPDATED ROW', object: 'EMPLOYEES' })
							}
							return record.dataValues;
						}
						else return null;
					});
			} else {
				//Find Application
				return Db.models.Applications.findOne({ where: { id: args.ApplicationId } })
					.then(_ => {
						let { id } = _.dataValues;
						let { hireDate, startDate } = args;
						//Create Employee
						return Db.models.Employees.create({
							idRole: 13,
							hireDate,
							startDate,
							isActive: true,
							userCreated: args.codeuser || 1,
							userUpdated: args.codeuser || 1
						})
							.then(_emp => {
								let _newEmp = _emp.dataValues;
								//Create realation between Employee and Application
								return Db.models.ApplicationEmployees.create({
									ApplicationId: id,
									EmployeeId: _newEmp.id
								}).then(_relation => {
									return _newEmp
								})
							})
					})
			}
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
					if (record) {
						if (args.codeuser) {
							let { codeuser, nameUser } = args;
							insertAuditLog({ codeuser, nameUser, action: 'UPDATED ROW', object: 'EMPLOYEES' })
						}
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

						if (args.codeuser) {
							let { codeuser, nameUser } = args;
							insertAuditLog({ codeuser, nameUser, action: 'DELTED ROW', object: 'EMPLOYEES' })
						}

						return record.dataValues;
					}
					else return null;
				});
		}
	}
};

export default EmployeesMutation;
