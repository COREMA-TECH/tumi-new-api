import { inputInsertRoles } from '../types/operations/insertTypes';
import { inputUpdateRoles } from '../types/operations/updateTypes';
import { RolesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const RolesMutation = {
	addRol: {
		type: RolesType,
		description: 'Add Rol to database',
		args: {
            rol: { type: inputInsertRoles }
		},
		async resolve(source, args) {
			let rolFound = await Db.models.Roles.findOne({where: {Description: args.rol.Description}});
            if(rolFound){
                return Db.models.Roles.update(args.rol,
					{
						where: {
							Id: rolFound.Id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
					else return null;
				});
            }
            else {
                return Db.models.Roles.create(args.rol, { returning: true }).then((ret) => {
                    return ret;
                });
            }

		}
	},
	updateRol: {
		type: RolesType,
		description: 'Update Rol Info',
		args: {
            rol: { type: inputUpdateRoles }
		},
		resolve(source, args) {
			return Db.models.Roles
				.update(
					{
						...args.rol
					},
					{
						where: {
							Id: args.rol.Id
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
	deleteRol: {
		type: RolesType,
		description: 'Delete Rol from database',
		args: { Id: { type: GraphQLInt } },
		resolve(source, args) {
			return Db.models.Roles
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

export default RolesMutation;
