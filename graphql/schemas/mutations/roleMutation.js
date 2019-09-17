import { inputInsertRoles } from '../types/operations/insertTypes';
import { inputUpdateRoles } from '../types/operations/updateTypes';
import { RolesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

// const addOrActiveRegionsRoles = async (rolId, listRegionsId) => {
// 	let regionRolesFound = await Db.models.RegionsRoles.findAll({ where: {RolId: rolId} });
	
// 	let inactiveRegionsRoles = regionRolesFound.filter(rr => !listRegionsId.includes(rr.RegionId)).map(rr => {
// 		return Db.models.RegionsRoles.update({isActive: false},{where: {id: rr.id}, returning: true});
// 	});
	
// 	console.log('regionsroles encontradas -- ', regionRolesFound); // TODO: (LF) Quitar console log
//     let updateRegionsRoles = listRegionsId.map(async regionId => {
//         const regionRole = await regionRolesFound.find(rr => rr.RegionId === regionId);
//         if(regionRole)
//             return Db.models.RegionsRoles.update({isActive: true},{where: {id: regionRole.id}, returning: true});
//         else
//             return Db.models.RegionsRoles.create({
//                 RolId: rolId,
//                 RegionId: regionId,
//                 isActive: true
//             });
//     });
    
//     return Promise.all([inactiveRegionsRoles,updateRegionsRoles]);
// }

const RolesMutation = {
	addRol: {
		type: RolesType,
		description: 'Add Rol to database',
		args: {
            rol: { type: inputInsertRoles }
		},
		async resolve(source, args) {
			console.log('Entrando a la mutacion para agregar rol'); // TODO. (LF) Quitar console log
			let rolFound = await Db.models.Roles.findOne({where: {Description: args.rol.Description}});
			console.log('+++++++++++++++++++++++++++++Mostrando el rol encontrado', rolFound); // TODO. (LF) Quitar console log
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
            console.log('argumentos ', args); // TODO: (LF) Quitar console log
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
