import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ApplicationType, ApplicationCompletedDataType, ApplicationTypeBoard } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';


const Op = Sequelize.Op;
const FilterStatus = (filter) => {
	console.log("FilterStatus " + filter)
	if (filter.isActive) { return { isActive: filter.isActive } }
	else { return {} }
}

const getRecruiterReportFilters = (filter) => {
	var newFilter = {};

	//Validate if filter object exists
	if (!filter)
		return newFilter;

	//Loop trough eacth filter
	for (var prop in filter) {
		//Validate if the filter has value
		if (filter[prop])
			//Exclude startDate and endDate from filters
			if (!["startDate", "endDate"].join().includes(prop))
				newFilter = { ...newFilter, [prop]: filter[prop] };
	}
	//Filter by startDate and endDate
	if (filter.startDate && filter.endDate)
		newFilter = {
			...newFilter,
			[Op.and]: [
				{ createdAt: { [Op.gte]: filter.startDate } },
				{ createdAt: { [Op.lte]: filter.endDate } }
			]


		}
	console.log(newFilter);
	return newFilter;
}

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
			},
			UserId:
			{
				type: GraphQLInt
			},
			socialSecurityNumber: {
				type: GraphQLString
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
			idUsers: { type: GraphQLInt },
			Id_Department: { type: GraphQLInt },
			idEntity: { type: GraphQLInt },
			isActive: { type: new GraphQLList(GraphQLBoolean) }
		},
		resolve(root, args) {
			return Db.models.Applications.findAll(
				{
					where: { isActive: { [Op.in]: args.isActive } },
					as: "Applications",
					include: [{
						model: Db.models.ApplicationEmployees,
						required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
						include: [{
							model: Db.models.Employees,
							required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
							as: "Employees",
							where: { idEntity: args.idEntity, Id_Deparment: args.Id_Department }
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
			ShiftId: { type: GraphQLInt },
			WorkOrderId: { type: GraphQLInt }
		},
		resolve(root, args) {

			return Db.models.Applications.findAll({
				where: {
					//isLead: true,
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
					/*{
						model: Db.models.ApplicationPhases,
						where: { WorkOrderId: args.WorkOrderId, ShiftId: args.ShiftId },
						required: false,
					}*/
				],

			})
		}
	},
	applicationCompleted: {
		type: GraphQLBoolean,
		description: "This shows if an application is completed or no",
		args: {
			id: { type: new GraphQLNonNull(GraphQLInt) }
		},
		resolve(root, args) {
			return Db.models.Applications.findOne({
				where: { ...args },
				include: [{
					model: Db.models.ApplicantBackgroundChecks,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantDisclosures,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantConductCodes,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantHarassmentPolicy,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantWorkerCompensation,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantW4,
					where: { completed: true },
					required: true
				}, {
					model: Db.models.ApplicantI9,
					where: { completed: true },
					required: true
				}]
			})
				.then(_application => {
					return _application != null; //Return true when all record associated to this application are completed
				})

		}
	},
	applicationCompletedData: {
		type: ApplicationCompletedDataType,
		description: "This shows if an application is completed or no",
		args: {
			id: { type: new GraphQLNonNull(GraphQLInt) }
		},
		resolve(root, args) {
			return Db.models.Applications.findOne({
				where: { ...args },
				include: [{
					model: Db.models.ApplicantBackgroundChecks,
				}, {
					model: Db.models.ApplicantDisclosures,
				}, {
					model: Db.models.ApplicantConductCodes,
				}, {
					model: Db.models.ApplicantHarassmentPolicy,
				}, {
					model: Db.models.ApplicantWorkerCompensation,
				}, {
					model: Db.models.ApplicantW4,
				}, {
					model: Db.models.ApplicantI9,
				}]
			}).then(_application => {
				var ApplicationsStatus = {
					ApplicantBackgroundCheck: _application.dataValues.ApplicantBackgroundCheck == null ? false : _application.dataValues.ApplicantBackgroundCheck.completed,
					ApplicantDisclosure: _application.dataValues.ApplicantDisclosure == null ? false : _application.dataValues.ApplicantDisclosure.completed,
					ApplicantConductCode: _application.dataValues.ApplicantConductCode == null ? false : _application.dataValues.ApplicantConductCode.completed,
					ApplicantHarassmentPolicy: _application.dataValues.ApplicantHarassmentPolicy == null ? false : _application.dataValues.ApplicantHarassmentPolicy.completed,
					ApplicantWorkerCompensation: _application.dataValues.ApplicantWorkerCompensation == null ? false : _application.dataValues.ApplicantWorkerCompensation.completed,
					ApplicantW4: _application.dataValues.ApplicantW4 == null ? false : _application.dataValues.ApplicantW4.completed,
					ApplicantI9: _application.dataValues.ApplicantI9 == null ? false : _application.dataValues.ApplicantI9.completed

				};
				console.log({ ApplicationsStatus });
				return ApplicationsStatus; //Return true when all record associated to this application are completed
			})

		}
	},
	recruiterReport: {
		type: new GraphQLList(ApplicationType),
		description: 'List applications records',
		args: {
			isActive: {
				type: GraphQLBoolean
			},
			isLead: {
				type: GraphQLBoolean
			},
			UserId:
			{
				type: GraphQLInt
			},
			startDate: {
				type: GraphQLDate
			},
			endDate: {
				type: GraphQLDate
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findAll({ where: { ...getRecruiterReportFilters(args) } });
		}
	},

};

export default ApplicationQuery;
