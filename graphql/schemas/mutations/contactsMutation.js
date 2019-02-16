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
};

export default ContactsMutation;
