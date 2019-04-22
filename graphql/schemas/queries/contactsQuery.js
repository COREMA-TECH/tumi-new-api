import { GraphQLInt, GraphQLList } from 'graphql';
import { ContactsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ContactsQuery = {
    contacts: {
        type: new GraphQLList(ContactsType),
        description: 'List of Contacts',
        args: {
            id: {
                type: GraphQLInt
            },
            Id_Entity: {
                type: new GraphQLList(GraphQLInt)
            },
            IsActive: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Contacts.findAll({ where: args });
        }
    }
};

export default ContactsQuery;
