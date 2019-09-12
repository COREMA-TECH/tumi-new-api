import { inputInsertRegionsRoles } from '../types/operations/insertTypes';
import { inputUpdateRegionsRoles } from '../types/operations/updateTypes';
import { RegionsRolesType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const RegionsRolesMutation = {
    addRegionRol: {
        type: new GraphQLList(RegionsRolesType),
        description: 'Add Region by Rol relation',
        args: {
            regionsRoles: { type: new GraphQLList(inputInsertRegionsRoles) }
        },
        resolve(source, args) {
            return Db.models.RegionsRoles.bulkCreate(args.regionsRoles, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateRegionRol: {
        type: RegionsRolesType,
        description: 'Update Region by Rol relation',
        args: {
            regionRol: { type: inputUpdateRegionsRoles }
        },
        resolve(source, args) {

            return Db.models.RegionsRoles
                .update(
                        args.regionRol,
                    {
                        where: {
                            id: args.regionRol.id
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

export default RegionsRolesMutation;
