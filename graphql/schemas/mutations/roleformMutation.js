import { inputInsertRolesForms } from '../types/operations/insertTypes';
import { inputUpdateRolesForms } from '../types/operations/updateTypes';
import { RolesFormsType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const RolesFormsMutation = {
	addRolesforms: {
		type: new GraphQLList(RolesFormsType),
		description: 'Add RolesFormsType to database',
		args: {
			rolesforms: { type: new GraphQLList(inputInsertRolesForms) }
		},
		resolve(source, args) {
			console.log("Estanis eb addRolesforms ", args)
			return Db.models.RolesForms.bulkCreate(args.rolesforms, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateRolesforms: {
		type: RolesFormsType,
		description: 'Update Employees Info',
		args: {
			rolesforms: { type: inputUpdateRolesForms }
		},
		resolve(source, args) {
			console.log("Estanis eb addRolesforms ", args)
			return Db.models.RolesForms
				.update(
					{
						IdRoles: args.rolesforms.IdRoles,
						IdForms: args.rolesforms.IdForms,
						IsActive: args.rolesforms.IsActive,
						userCreated: args.rolesforms.userCreated,
						userUpdated: args.rolesforms.userUpdated,
						Date_Created: args.rolesforms.Date_Created,
						Date_Updated: args.rolesforms.Date_Updated

					},
					{
						where: {
							Id: args.rolesforms.Id
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
	deleteRolesForms: {
		type: RolesFormsType,
		description: 'Delete employees record from database',
		args: { Id: { type: GraphQLInt } },
		resolve(source, args) {
			console.log("RolesForms ", args)
			return Db.models.RolesForms
				.update(
					{
						IsActive: 0
					},
					{
						where: {
							Id: args.Id
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

export default RolesFormsMutation;
