import { GraphQLList, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLObjectType } from 'graphql';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UsersType, UserLoginType, ApplicationType, ContactsType } from '../types/operations/outputTypes';
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
            Id_Contact: { type: GraphQLInt },
            Code_User: { type: GraphQLString },
            Id_Entity: { type: GraphQLInt },
            manageApp: { type: GraphQLBoolean }

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
    },

    getvalid_users: {
        type: UserLoginType,
        description: "Verify user",
        args: {
            Code_User: { type: GraphQLString },
            Password: { type: GraphQLString }
        },
        async resolve(_, args) {
            console.log("Entered right function");
            const {Code_User, Password} = args;            
            const {dataValues: user} = await Db.models.Users.findOne({
                where: { Code_User },
                returning: true
            });

            if(!user){
                throw new Error("Access Denied");
            }

            const match = await bcrypt.compare(Password, user.Password);

            if(!match){
                throw new Error("Access Denied");
            }

            const Token = await jwt.sign({ user: { Id: user.Id, Code_User: user.Code_User }}, process.env.SECRET, { expiresIn: '1y' });
            return {...user, Token};
        }
    }
};

export default userQuery;
