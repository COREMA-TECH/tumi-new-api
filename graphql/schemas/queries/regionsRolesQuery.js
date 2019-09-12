import { GraphQLList } from 'graphql';
import { inputUpdateRegionsRoles } from '../types/operations/updateTypes';
import { RegionsRolesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const RegionsRolesQuery = {
    RegionsRoles: {
        type: new GraphQLList(RegionsRolesType),
        description: 'List Regions by Roles',
        args: {
            regionRol: { type: inputUpdateRegionsRoles }
        },
        resolve(root, args) {
            return Db.models.RegionsRoles.findAll({ 
                where: args,
                include: [
                    {
                        model: Db.models.Roles,
                        required: true
                    },
                    {
                        model: Db.models.CatalogItem,
                        required: true
                    }
                ]
            });
        }
    }
};

export default RegionsRolesQuery;
