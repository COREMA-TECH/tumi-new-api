import { inputInsertEmployees } from '../types/operations/insertTypes';
import { inputUpdateEmployees } from '../types/operations/updateTypes';
import { EmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

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
				return ret.map((data) => {
					return data.dataValues;
				});
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
				.update(
					{
						firstName: args.employees.IdEntity,
						lastName: args.employees.IdEntity,
						electronicAddress: args.employees.IdEntity,
						mobileNumber: args.employees.IdEntity,
						idRole: args.employees.IdEntity,
						isActive: args.employees.IdEntity,
						userCreated: args.employees.IdEntity,
						userUpdated: args.employees.IdEntity
					},
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
		type: GraphQLInt,
		description: 'Delete employees record from database',
		args: {
			//id: { type: GraphQLList(GraphQLInt) }
			id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Employees
				.update(
					{
						isActive: 0
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
