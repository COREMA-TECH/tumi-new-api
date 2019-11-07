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

	toggleRolesForms: {
		type: GraphQLBoolean,
		description: "Toggles relationship on/off",
		args: {
			IdRoles: { type: GraphQLInt },
			rolesForms: { type: new GraphQLList(GraphQLInt) },
			IsActive: { type: GraphQLBoolean }
		},
		async resolve(root, args) {
			let result = true;

			for(let formId of args.rolesForms){
				const IsActive = args.IsActive ? 1 : 0;

                await Db.models.RolesForms.update({ IsActive }, {
                    where: {
						IdForms: formId,
						IdRoles: args.IdRoles
                    },
                    returning: true
                })
                .catch(error => {      
					result = false;
                })
			}
			
			return result;
		}
	},
	
	deleteRolesForms: {
		type: RolesFormsType,
		description: 'Delete employees record from database',
		args: { Id: { type: GraphQLInt } },
		resolve(source, args) {
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
