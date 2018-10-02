import { GraphQLInt, GraphQLList } from 'graphql';
import { CompanyPreferenceType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const CompanyPreferenceQuery = {
	companyPreferences: {
		type: new GraphQLList(CompanyPreferenceType),
		description: 'List of company preferences',
		args: {
			id: {
				type: GraphQLInt
			},
			EntityId: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.CompanyPreferences.findAll({ where: args });
		}
	}
};

export default CompanyPreferenceQuery;
