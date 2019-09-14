import { inputInsertRoles } from '../types/operations/insertTypes';
import { inputUpdateRoles } from '../types/operations/updateTypes';
import { RolesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const addOrActiveRegionsRoles = async (rolId, listRegionsId) => {
    let regionRolesFound = await Db.models.RegionsRoles.findAll({ where: {RolId: rolId} });
    console.log('regionsroles encontradas -- ', regionRolesFound); // TODO: (LF) Quitar console log
    let updateRegionsRoles = listRegionsId.map(regionId => {
        const regionRole = regionRolesFound.find(rr => rr.RegionId === regionId);
        if(regionRole)
            return Db.models.RegionsRoles.update({isActive: true},{where: {id: regionRole.id}, returning: true});
        else
            return Db.models.RegionsRoles.create({
                RolId: rolId,
                RegionId: regionId,
                isActive: true
            });
    });
    
    return Promise.all(updateRegionsRoles);
}

const RolesMutation = {
	addRol: {
		type: RolesType,
		description: 'Add Rol to database',
		args: {
            rol: { type: inputInsertRoles },
            regionsId: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
            let rolFound = Db.models.Roles.findOne({where: {Description: rol.Description}});
            if(rolFound){
                let { IsActive, ...restRol } = args.rol;
                return Db.models.Roles.update({...restRol, IsActive: 1},
					{
						where: {
							Id: rolFound.Id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
                    if (record) {
                        if(args.regionsId && args.regionsId.length){
                            return addOrActiveRegionsRoles(rolFound.Id, args.regionsId).then(_ => {
                                return record.dataValues;
                            });
                        }
                        else return record.dataValues;
                    }
					else return null;
				});
            }
            else {
                return Db.models.Roles.create(args.rol, { returning: true }).then((ret) => {
                    if(args.regionsId && args.regionsId.length){
                        let regionsRoles = args.regionsId.map(regionId => {
                            return {
                                RolId: args.rol.Id,
                                RegionId: regionId,
                                isActive: true
                            }
                        });
    
                        return Db.models.RegionsRoles.bulkCreate(regionsRoles, { returning: true }).then(res => {
                            return ret;
                        })
                    }
                    else return ret;
                });
            }

		}
	},
	updateRol: {
		type: RolesType,
		description: 'Update Rol Info',
		args: {
            rol: { type: inputUpdateRoles },
            regionsId: { type: new GraphQLList(GraphQLInt) }
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
                    if (record) {
                        if(args.regionsId && args.regionsId.length){
                            return addOrActiveRegionsRoles(args.rol.Id, args.regionsId).then(_ => {
                                return record.dataValues;
                            });
                        }
                        else return record.dataValues;
                    }
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
