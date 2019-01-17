import { GraphQLInt, GraphQLList } from 'graphql';
import { RolesFormsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const RolesFormsQuery = {
    rolesforms: {
        type: new GraphQLList(RolesFormsType),
        description: 'List of Roles',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
            IdRoles: {
                type: GraphQLInt
            },
            IdForms: {
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.RolesForms.findAll({ where: args });
        }
    }
};

export default RolesFormsQuery;
