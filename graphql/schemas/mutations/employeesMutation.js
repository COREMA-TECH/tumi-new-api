import { inputInsertEmployees } from '../types/operations/insertTypes';
import { inputUpdateEmployees } from '../types/operations/updateTypes';
import { EmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const EmployeesMutation = {
	addEmployees: {
		type: new GraphQLList(EmployeesType),
		description: 'Add Employees to database',
		args: {
			Employees: { type: new GraphQLList(inputInsertEmployees) }
		},
		resolve(source, args) {
			return Db.models.Employees.bulkCreate(args.Employees, { returning: true }).then((ret) => {
				return ret.dataValues;
			});
		}
	},
	updateEmployees: {
		type: EmployeesType,
		description: 'Update Employees Info',
		args: {
			employees: { type: inputUpdateEmployees }
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
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
	deleteEmployees: {
		type: EmployeesType,
		description: 'Delete employees record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
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
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default EmployeesMutation;
