import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { UsersType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const userQuery = {
    user: {
        type: new GraphQLList(UsersType),
        description: 'List User records',
        args: {
            IsActive: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Users.findAll({ where: args });
        }
    }

};

export default userQuery;
