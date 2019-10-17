import { GraphQLInt, GraphQLList } from 'graphql';
import { inputUpdateApplicationDocumentType } from '../types/operations/updateTypes';
import { ApplicationDocumentTypeType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicationDocumentTypeQuery = {
	applicationDocumentTypes: {
		type: new GraphQLList(ApplicationDocumentTypeType),
		description: 'List Application Document Type',
		args: {
            applicationDocumentType: { type: inputUpdateApplicationDocumentType }
		},
		resolve(root, args) {
			return Db.models.ApplicationDocumentType.findAll({ where: args.applicationDocumentType });
		}
	}
};

export default ApplicationDocumentTypeQuery;