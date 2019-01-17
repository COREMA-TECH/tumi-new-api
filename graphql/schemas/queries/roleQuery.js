import { GraphQLInt, GraphQLList } from 'graphql';
import { RolesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const RolesQuery = {
    roles: {
        type: new GraphQLList(RolesType),
        description: 'List of Roles',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.Roles.findAll({ where: args });
        }
    }
};

export default RolesQuery;
