import { inputInsertContact } from '../types/operations/insertTypes';
import { ContactsType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const ContactsMutation = {
	addContacts: {
		type: new GraphQLList(ContactsType),
		description: 'Add Contacts Type to database',
		args: {
			contacts: { type: new GraphQLList(inputInsertContact) }
		},
		resolve(source, args) {
			return Db.models.Contacts.bulkCreate(args.contacts, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	disableContactByHotel_Application: {
		type: new GraphQLList(ContactsType),
		description: 'Disable contact by hotel and application Ids',
		args: {
			Id_Entity: { type: GraphQLInt },
			ApplicationId: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.Contacts.update({ IsActive: 0 }, { where: { Id_Entity: args.Id_Entity, ApplicationId: args.ApplicationId } });
		}
	},
};

export default ContactsMutation;
