import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { ApplicationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicationQuery = {
	applications: {
		type: new GraphQLList(ApplicationType),
		description: 'List applications records',
		args: {
			id: {
				type: GraphQLInt
			},
			firstName: {
				type: GraphQLString
			},
			isActive: {
				type: GraphQLBoolean
			},
			idLanguage: {
				type: GraphQLInt
			},
			isLead: {
				type: GraphQLBoolean
			},
			positionApplyingFor:
			{
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findAll({ where: args });
		}
	},
	applicationsByUser: {
		type: new GraphQLList(ApplicationType),
		description: 'List applications records',
		args: {
			idUsers: { type: GraphQLInt }
		},
		resolve(root, args) {
			return Db.models.Applications.findAll(
				{
					where: { isActive: true },
					as: "Applications",
					include: [{
						model: Db.models.ApplicationEmployees,
						required: true,
						include: [{
							model: Db.models.Employees,
							required: true,
							as: "Employees",
							where: args
						}]

					}]
				});
		}
	}
};

export default ApplicationQuery;
