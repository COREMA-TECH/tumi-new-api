import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql';
import { ApplicationType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

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
	},
	applicationsByMatches: {
		type: new GraphQLList(ApplicationType),
		description: 'List applications records',
		args: {
			language: { type: GraphQLBoolean },
			experience: { type: GraphQLBoolean },
			Position: { type: GraphQLString },
			//isLead: { type: GraphQLBoolean },
			//isActive: { type: GraphQLBoolean },
			ShiftId: { type: GraphQLInt },
			WorkOrderId: { type: GraphQLInt },
		},
		resolve(root, args) {

			return Db.models.Applications.findAll({
				where: {
					//isLead: args.isLead,
					isActive: true
				},
				include: [
					{
						model: Db.models.ApplicantLanguages,
						where: { language: '194' },
						required: args.language
					},
					{
						model: Db.models.ApplicantPreviousEmployments,
						required: args.experience,
					},
					{
						model: Db.models.ApplicantIdealJobs,
						where: { description: { [Op.iLike]: args.Position + '%' } },
						required: true
					},
					{
						model: Db.models.ApplicationPhases,
						where: { WorkOrderId: args.WorkOrderId, ShiftId: args.ShiftId },
						required: false,

					}
				],
			});
		}
	}

};

export default ApplicationQuery;
