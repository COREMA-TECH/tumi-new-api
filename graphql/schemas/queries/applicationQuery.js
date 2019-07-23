import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ApplicationCodeUserType, ApplicationType, ApplicationCompletedDataType, ApplicationTypeBoard } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';


const Op = Sequelize.Op;
const FilterStatus = (filter) => {
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
			},
			idRecruiter: {
				type: GraphQLInt
			},
			homePhone: {
				type: GraphQLString
			},
			cellPhone: {
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
			Id_Deparment: { type: GraphQLInt },
			idEntity: { type: GraphQLInt },
			isActive: { type: new GraphQLList(GraphQLBoolean) }
		},
		resolve(root, args) {
			let isActiveFilter = {};
			if (args.isActive) {
				isActiveFilter = { isActive: { [Op.in]: args.isActive } }
			}
			return Db.models.Applications.findAll(
				{
					where: { ...isActiveFilter },
					as: "Applications",
					include: [{
						model: Db.models.ApplicationEmployees,
						required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
						include: [{
							model: Db.models.Employees,
							required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
							as: "Employees",
							where: args
						}]

					}]
				}).then(_ => {
					let applicationList = [];
					let applicationIds = [];
					//Get applications and applications ids
					_.map(_application => {
						let application = _application.dataValues;

						applicationIds.push(application.id);
						applicationList.push(_application);

					})
					//return first filter if idEntity is null and idUser and Id_Department have values
					if (!args.idEntity || args.idUsers || args.Id_Department) return applicationList;

					//Get applications by contacts and hotel
					return Db.models.Contacts.findAll({ where: { Id_Entity: args.idEntity, IsActive: 1, ApplicationId: { $notIn: applicationIds } } })
						.then(_contacts => {
							applicationIds = [];//reset array
							_contacts.map(_contact => {
								let contact = _contact.dataValues;
								applicationIds.push(contact.ApplicationId);
							})
							return Db.models.Applications.findAll(
								{
									where: { isActive: { [Op.in]: args.isActive }, id: { $in: applicationIds } },
								})
								.then(_applicationContacts => {
									_applicationContacts.map(_applicationContact => {
										applicationList.push(_applicationContact);
									})
									return applicationList;
								})
						})
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
					// {
					// 	model: Db.models.ApplicantIdealJobs,
					// 	where: { description: { [Op.iLike]: args.Position + '%' } },
					// 	required: true
					// },
					{
						model: Db.models.ApplicationPhases,
						where: { WorkOrderId: args.WorkOrderId, ShiftId: args.ShiftId },
						required: false,
					}
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
	applicationCodeUser: {
		type: new GraphQLList(ApplicationCodeUserType),
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
			return Db.models.Applications.findAll({
				where: args,
				include: [{
					model: Db.models.ApplicationEmployees,
					include: [{
						model: Db.models.Employees,
						as: 'Employees',
						include: [{
							model: Db.models.Users
						}]
					}]
				}]
			}).then(applications => {
				let applicationsArray = [];
				let Code_User = '';
				applicationsArray = applications.map(application => {
					if (application.dataValues.ApplicationEmployee)
						Code_User = application.dataValues.ApplicationEmployee.dataValues.User ? application.dataValues.ApplicationEmployee.dataValues.Employees.dataValues.User.dataValues.Code_User : null;
					return {
						id: application.dataValues.id,
						Code_User: Code_User
					};
				});
				return applicationsArray;
			});
		}
	},
	validateApplicationUniqueness: {
		type: ApplicationType,
		description: 'Return an specific Application filtered by Name , Phone and SSN, this is to validate Application Uniqueness',
		args: {
			firstName: { type: new GraphQLNonNull(GraphQLString) },
			lastName: { type: new GraphQLNonNull(GraphQLString) },
			socialSecurityNumber: { type: new GraphQLNonNull(GraphQLString) },
			homePhone: { type: new GraphQLNonNull(GraphQLString) },
			cellPhone: { type: new GraphQLNonNull(GraphQLString) },
			id: { type: new GraphQLNonNull(GraphQLInt) }
		},
		resolve(root, args) {
			return Db.models.Applications.findOne({
				where: {
					id: { $ne: args.id },
					isActive: true,
					$or: [
						{
							$and: [
								Sequelize.where(
									Sequelize.fn('upper', Sequelize.col('firstName')), {
										$eq: args.firstName.toUpperCase()
									}
								),
								Sequelize.where(
									Sequelize.fn('upper', Sequelize.col('lastName')), {
										$eq: args.lastName.toUpperCase()
									}
								),
								{
									$or: [{
										cellPhone: args.cellPhone
									},
									{
										homePhone: args.homePhone
									}]
								}
							]
						},
						{
							$and: [{
								socialSecurityNumber: args.socialSecurityNumber
							},
							{
								socialSecurityNumber: {
									$ne: ''
								}
							}]
						}
					]
				}
			})
		}
	}
};

export default ApplicationQuery;
