import { GraphQLList, GraphQLInt } from 'graphql';
import { UsersType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const userQuery = {
    user: {
        type: new GraphQLList(UsersType),
        description: 'List User records',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
            Id_Roles: {
                type: new GraphQLList(GraphQLInt)
            },
            IdRegion: {
                type: GraphQLInt
            },
            Id_Entity: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Users.findAll({ where: args });
        }
    }

};

export default userQuery;
