import { GraphQLList, GraphQLInt } from 'graphql';
import { UsersType, ApplicationType, ContactsType } from '../types/operations/outputTypes';
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
            Id_Contact: { type: GraphQLInt }

        },
        resolve(root, args) {
            return Db.models.Users.findAll({ where: args });
        }
    },

    userApplication: {
        type: ApplicationType,
        description: 'Application info of a user',
        args: {
            Id: { type: GraphQLInt }
        },

        resolve(root, args) {
            return Db.models.Applications.findOne({
                include: [
                    { 
                        model: Db.models.Employees,
                        where: { idUsers: args.Id }
                    }
                ]
            })
        }
    },

    userContact: {
        type: ContactsType,
        description: 'Contact related to a user',
        args: {
            Id: { type: GraphQLInt }
        },

        resolve(root, args) {
            return Db.models.Contacts.findOne({
                include: [
                    {
                        model: Db.models.Users,
                        as: "Users",
                        where: { Id: args.Id }
                    }
                ]
            })
        }
    }

};

export default userQuery;
