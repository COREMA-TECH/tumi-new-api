import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ApplicationCodeUserType, ApplicationType, ApplicationCompletedDataType, UsersType, ApplicationListType } from '../types/operations/outputTypes';
import Db from '../../models/models';
const PDFMerge = require('pdf-merge');
import axios from 'axios';

import fs from 'fs';
//const path = require('path');
import http from 'http';
const uuidv4 = require('uuid/v4');

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';
import { isArray } from 'util';

const tokenApiPdfMerge = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VyIjoiNlA0MTczNDU0ciIsImVtYWlsIjoibHVpcy5mYWphcmRvQHNtYnNzb2x1dGlvbnMuY29tIn0sImlhdCI6MTU2NzU1MTI2NX0.bryGpfwXuhsydPT0HZv8e79Kul5QkIZTMVmupUdpxn4';

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

const pdfMergeApi = (data) => {
	return new Promise((resolve, reject) => {
		const config = {
            headers: {
				'Content-Type': 'application/json',
                authorization: tokenApiPdfMerge
            }
        };
        
        axios.post('http://localhost:3000/api/documents', {
			urls: data
		}, config)
        .then(function (response) {
            resolve(response);
        })
        .catch(function (error) {
            reject(error);
        });
	});
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
		type: new GraphQLList(ApplicationListType),
		description: 'List applications records',
		args: {
			idUsers: { type: GraphQLInt },
			Id_Deparment: { type: GraphQLInt },
			idEntity: { type: GraphQLInt },
			isActive: { type: new GraphQLList(GraphQLBoolean) },
			id: { type: GraphQLInt }
		},
		resolve(root, args) {
			let isActiveFilter = {};
			let { idEntity, id, ...rest } = args;
			let { isActive, ...employeeArgs } = rest;
			let employeeByHotelFilter = {}
			let idFilter = {};

			if (args.isActive) {
				isActiveFilter = { isActive: { [Op.in]: args.isActive } }
			}
			if (args.idEntity)
				employeeByHotelFilter = { BusinessCompanyId: args.idEntity }
			if (args.id)
				idFilter = { id: args.id }

			return Db.models.Applications.findAll(
				{
					where: { ...isActiveFilter, ...idFilter },
					as: "Applications",
					include: [{
						model: Db.models.ApplicationEmployees,
						required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
						include: [{
							model: Db.models.Employees,
							required: args.idUsers != null || args.idEntity != null || args.Id_Department != null,
							as: "Employees",
							where: employeeArgs,
							include: [
								{
									required: args.idEntity != null,
									model: Db.models.EmployeeByHotels,
									where: { ...employeeByHotelFilter }
								}
							]
						}]

					}, {
						model: Db.models.Users,
						as: 'Recruiter'
					}, {
						model: Db.models.WorkOrder,
						as: 'PositionApplyingFor',
						include: [{
							model: Db.models.PositionRate
						}, {
							model: Db.models.BusinessCompany,
							as: 'BusinessCompanyWO'
						}]
					}, {
						model: Db.models.Users,
						as: 'User'
					}]
				})
				.then(_ => {
					let dataList = [];

					_.map(app => {
						let { Recruiter, PositionApplyingFor, ApplicationEmployee, User } = app.dataValues;
						let record = {
							...app.dataValues,
							workOrderId: null,
							Position: null,
							Recruiter: null,
							Employee: null
						}
						if (User)
							record = { ...record, User: User.dataValues };
						if (Recruiter)
							record = { ...record, Recruiter: Recruiter.dataValues };
						if (PositionApplyingFor) {
							let { id, PositionRate, BusinessCompanyWO } = PositionApplyingFor;
							record = { ...record, workOrderId: id };
							if (PositionRate)
								record = { ...record, Position: PositionRate.dataValues }
							if (BusinessCompanyWO)
								record = { ...record, PositionCompany: BusinessCompanyWO.dataValues }
						}
						if (ApplicationEmployee) {
							let appEmp = ApplicationEmployee.dataValues;
							if (appEmp.Employees) {
								let employee = appEmp.Employees.dataValues;
								record = { ...record, Employee: employee }
							}
						}
						dataList.push(record);
					})
					return dataList;
				})
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
						Code_User = application.dataValues.ApplicationEmployee.dataValues.Employees.dataValues.User ? application.dataValues.ApplicationEmployee.dataValues.Employees.dataValues.User.dataValues.Code_User : null;
					return {
						id: application.dataValues.id,
						Code_User: Code_User
					};
				});
				return applicationsArray;
			});
		}
	},

	applicationUser: {
		type: UsersType,
		description: 'User linked to an application',
		args: {
			Id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findOne({
				where: { id: args.Id },
				include: [{
					model: Db.models.Employees,
					include: [{
						model: Db.models.Users
					}]
				}]
			}).then(application => {
				return application.dataValues.Employees.length > 0 ? application.dataValues.Employees[0].dataValues.User.dataValues : null;
			})
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
	},

	pdfMergeQuery: {
		type: GraphQLString,
		description: 'pdf merging',
		args: {
			applicationId: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			
			let files = [];

			return Db.models.Applications.findOne({
				where: { id: args.applicationId },
				include: [
					{
						model: Db.models.ApplicantBackgroundChecks,
						attributes: ['pdfUrl']
					},
					{
						model: Db.models.ApplicantDisclosures,
						attributes: ['pdfUrl']
					},
					{
						model: Db.models.ApplicantConductCodes,
						attributes: ['pdfUrl']
					},
					{
						model: Db.models.ApplicantHarassmentPolicy,
						attributes: ['pdfUrl']
					},
					{
						model: Db.models.ApplicantWorkerCompensation,
						attributes: ['pdfUrl']
					},
					{
						model: Db.models.ApplicantI9,
						attributes: ['url']
					},
					{
						model: Db.models.ApplicantW4,
						attributes: ['url']
					}
				]
			}).then(async resp => {
				
				if(resp){
					const {pdfUrl, ApplicantBackgroundCheck, ApplicantDisclosure, ApplicantConductCode,
						ApplicantHarassmentPolicy, ApplicantWorkerCompensation, ApplicantI9, ApplicantW4} = resp.dataValues;
					if(pdfUrl) files = [...files, pdfUrl];
					if(ApplicantBackgroundCheck) files = [...files, ApplicantBackgroundCheck.dataValues.pdfUrl];
					if(ApplicantDisclosure) files = [...files, ApplicantDisclosure.dataValues.pdfUrl];
					if(ApplicantConductCode) files = [...files, ApplicantConductCode.dataValues.pdfUrl];
					if(ApplicantHarassmentPolicy) files = [...files, ApplicantHarassmentPolicy.dataValues.pdfUrl];
					if(ApplicantWorkerCompensation) files = [...files, ApplicantWorkerCompensation.dataValues.pdfUrl];
					if(ApplicantI9) files = [...files, ApplicantI9.dataValues.url];
					if(ApplicantW4) files = [...files, ApplicantW4.dataValues.url];

					const serializedArray = JSON.stringify(files);

					try {
						let s3Url = await pdfMergeApi(serializedArray);
						return s3Url.data.url;
					}
					catch(err) {
						console.log(err);
						return null;
					}
				}
				else
					return null;
			});
		}
	}
};

export default ApplicationQuery;
