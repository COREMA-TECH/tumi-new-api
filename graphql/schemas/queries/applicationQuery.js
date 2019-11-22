import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ApplicationCodeUserType, ApplicationType, ApplicationCompletedDataType, UsersType, ApplicationListType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import axios from 'axios';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';
import { generatePdfFile } from '../../../Utilities/PdfManagement';
import { uploadToS3 } from '../../../Utilities/S3Management';
const fs = require('fs');
const tokenApiPdfMerge = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VyIjoiNlA0MTczNDU0ciIsImVtYWlsIjoibHVpcy5mYWphcmRvQHNtYnNzb2x1dGlvbnMuY29tIn0sImlhdCI6MTU2NzU1MTI2NX0.bryGpfwXuhsydPT0HZv8e79Kul5QkIZTMVmupUdpxn4';
const urlSmbsPdfApiLocal = 'http://localhost:3000/api/documents';
const urlSmbsPdfApiEc2 = 'http://ec2-3-18-223-95.us-east-2.compute.amazonaws.com:3000/api/documents';

const Op = Sequelize.Op;

const SUMMARY_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/Summary-EMPTY.pdf'
const W4_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/W4-EMPTY.pdf'
const I9_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/I9-EMPTY.pdf'
const BACKGROUNDCHECK_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/BackgroundCheck-EMPTY.pdf'
const ANTIHARASMENT_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/AntiHarassment-EMPTY.pdf'
const ANTIDISC_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/AntiDiscrimination-EMPTY.pdf'
const NONDISCLOSURE_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/NonDisclosure-EMPTY.pdf'
const NONRETALIATION_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/NonRetaliation-EMPTY.pdf'
const CONDUCTCODE_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/ConductCode-EMPTY.pdf'
const BENEFITELECTION_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/BenefitElection-EMPTY.pdf'
const WORKCOMP_EMPTY_URL = 'https://smbs-recruitment.s3.us-east-2.amazonaws.com/documents/WorkerCompensation-EMPTY.pdf'


const FilterStatus = (filter) => {
	if (filter.isActive) { return { isActive: filter.isActive } }
	else { return {} }
}

const getLegalDocumentInfo = (ApplicationId, ApplicationDocumentTypeId) => {
	return Db.models.ApplicantLegalDocument.findOne({
		where: { ApplicationId, ApplicationDocumentTypeId },
		order: [['createdAt', 'DESC']]
	}).then(result => {
		return result ? result.dataValues : null;
	});
}

async function newPdf(fileName, html) {
	try {
		return generatePdfFile(html, fileName.trim() + '.pdf').then(fileFullPath => {
			if (!fileFullPath) return null;

			return uploadToS3(fileFullPath).then(url => {
				fs.unlinkSync(fileFullPath);
				return url;
			});
		});
	} catch (err) {
		console.log('Database ' + err);
		return null;
	}
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

const pdfMergeApi = (filesUrl) => {
	return new Promise((resolve, reject) => {
		const config = {
			headers: {
				'Content-Type': 'application/json',
				authorization: tokenApiPdfMerge
			}
		};

		axios.post(urlSmbsPdfApiEc2, { urls: filesUrl }, config)
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
			id: { type: GraphQLInt },
			isLead: { type: GraphQLBoolean }
		},
		resolve(root, args) {
			let isActiveFilter = {};
			let { idEntity, id, isLead, ...rest } = args;

			delete rest.isLead;

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
					attributes: {
						include: [
							[Sequelize.literal('(SELECT count(DISTINCT( "ApplicationDocumentTypeId" )) AS "ApplicationDocumentTypeId" FROM	"public"."ApplicantLegalDocuments" AS"ApplicantLegalDocument" WHERE	"ApplicantLegalDocument"."ApplicationId" = "Applications"."id")'), 'totalAmount']
						]
					},
					include: [{
						model: Db.models.Users,
						as: 'Recruiter'
					}]
				})
				.then(async _ => {
					let dataList = [];

					const typeCount = await Db.models.ApplicationDocumentType.count();
					
					_.map(app => {
						let { Recruiter, User } = app.dataValues;
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

						record = { 
							...record,
							statusCompleted: app.totalAmount && app.totalAmount === typeCount ? 'YES' : 'NO' 
						};

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
		async resolve(root, args) {


			const getInformation = (documentId) => {
				return getLegalDocumentInfo(args.id, documentId)
			}
			let data = {
				W4: await getInformation(16),
				I9: await getInformation(12),
				BackgroundCheck: await getLegalDocumentInfo(args.id, 7),
				HarassmentPolicy: await getInformation(11),
				AntiDiscrimination: await getInformation(19),
				Disclosure: await getInformation(10),
				NonRelation: await getInformation(21),
				ConductCode: await getInformation(8),
				BenefitElection: await getInformation(22),
				WorkerCompensation: await getInformation(17),
			}

			let resultData = {};
			Object.keys(data).forEach(key => {
				resultData = { ...resultData, [key]: data[key] ? data[key].completed : false }
			});
			return Object.values(resultData).filter(value => value === false).length === 0;
		}
	},
	applicationCompletedData: {
		type: ApplicationCompletedDataType,
		description: "This shows if an application is completed or no",
		args: {
			id: { type: new GraphQLNonNull(GraphQLInt) }
		},
		async resolve(root, args) {


			const getInformation = (documentId) => {
				return getLegalDocumentInfo(args.id, documentId)
			}
			let data = {
				W4: await getInformation(16),
				I9: await getInformation(12),
				BackgroundCheck: await getLegalDocumentInfo(args.id, 7),
				HarassmentPolicy: await getInformation(11),
				AntiDiscrimination: await getInformation(19),
				Disclosure: await getInformation(10),
				NonRelation: await getInformation(21),
				ConductCode: await getInformation(8),
				BenefitElection: await getInformation(22),
				WorkerCompensation: await getInformation(17),
			}

			let resultData = {};
			Object.keys(data).forEach(key => {
				resultData = { ...resultData, [key]: data[key] ? data[key].completed : false }
			})
			return resultData;
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
			},
			summaryHtml: {
				type: GraphQLString
			}
		},
		async resolve(root, args) {

			const typeDocu = await Db.models.ApplicationDocumentType.findAll();
			const summaryPdfUrl = await newPdf('SummaryNHP', args.summaryHtml);
			const w4 = typeDocu.find(td => td && td.name === 'W4');
			const i9 = typeDocu.find(td => td && td.name === 'I9');
			const backgroundCheck = typeDocu.find(td => td && td.name === 'Background Check');
			const antiHarasment = typeDocu.find(td => td && td.name === 'Harassment Policies');
			const antiDiscrimination = typeDocu.find(td => td && td.name === 'Anti Discrimination');
			const nonDisclosure = typeDocu.find(td => td && td.name === 'Non Disclosure');
			const nonRetaliation = typeDocu.find(td => td && td.name === 'Non Retaliation');
			const conductCode = typeDocu.find(td => td && td.name === 'Conduct Code');
			const benefitElection = typeDocu.find(td => td && td.name === 'Benefit Form');
			const workerCompensation = typeDocu.find(td => td && td.name === 'Worker Compensation');

			const getDocumentURL = async (docId) => {
				let data = await getLegalDocumentInfo(args.applicationId, docId);
				return data ? data.url : null;
			}

			const w4PdfUrl = w4 ? await getDocumentURL(w4.id) : W4_EMPTY_URL;
			const i9PdfUrl = i9 ? await getDocumentURL(i9.id) : I9_EMPTY_URL;
			const backgroundCheckPdfUrl = backgroundCheck ? await getDocumentURL(backgroundCheck.id) : BACKGROUNDCHECK_EMPTY_URL;
			const antiHarasmentPdfUrl = antiHarasment ? await getDocumentURL(antiHarasment.id) : ANTIHARASMENT_EMPTY_URL;
			const antiDiscPdfUrl = antiDiscrimination ? await getDocumentURL(antiDiscrimination.id) : ANTIDISC_EMPTY_URL;
			const nonDisclosurePdfUrl = nonDisclosure ? await getDocumentURL(nonDisclosure.id) : NONDISCLOSURE_EMPTY_URL;
			const nonRetaliationPdfUrl = nonRetaliation ? await getDocumentURL(nonRetaliation.id) : NONRETALIATION_EMPTY_URL;
			const conductCodePdfUrl = conductCode ? await getDocumentURL(conductCode.id) : CONDUCTCODE_EMPTY_URL;
			const benefitElectionPdfUrl = benefitElection ? await getDocumentURL(benefitElection.id) : BENEFITELECTION_EMPTY_URL;
			const workerCompPdfUrl = workerCompensation ? await getDocumentURL(workerCompensation.id) : WORKCOMP_EMPTY_URL;

			try {
				let s3Url = await pdfMergeApi([
					summaryPdfUrl || SUMMARY_EMPTY_URL,
					w4PdfUrl || W4_EMPTY_URL,
					i9PdfUrl || I9_EMPTY_URL,
					backgroundCheckPdfUrl || BACKGROUNDCHECK_EMPTY_URL,
					antiHarasmentPdfUrl || ANTIHARASMENT_EMPTY_URL,
					antiDiscPdfUrl || ANTIDISC_EMPTY_URL,
					nonDisclosurePdfUrl || NONDISCLOSURE_EMPTY_URL,
					nonRetaliationPdfUrl || NONRETALIATION_EMPTY_URL,
					conductCodePdfUrl || CONDUCTCODE_EMPTY_URL,
					benefitElectionPdfUrl || BENEFITELECTION_EMPTY_URL,
					workerCompPdfUrl || WORKCOMP_EMPTY_URL
				]);
				return s3Url.data.url;
			}
			catch (err) {
				console.log(err);
				return null;
			}

		}
	},
	applicationPhaseByDate: {
		type: new GraphQLList(ApplicationType),
		description: 'List Application by Phases records by a date range',
		args: {
			startDate: {
				type: (GraphQLDate)
			},
			endDate: {
				type: (GraphQLDate)
			},
			idRecruiter: {
				type: (GraphQLInt)
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findAll({
				order: [['createdAt', 'DESC']],
				include: [
					{
						model: Db.models.ApplicationPhases,
						where: {
							ReasonId: 30458,
							UserId: args.idRecruiter,
							[Op.and]: [
								{ createdAt: { [Op.gte]: new Date(args.startDate.setUTCHours(0, 0, 0)) } },
								{ createdAt: { [Op.lte]: new Date(args.endDate.setUTCHours(23, 59, 59)) } }
							]
						}
					}

				]
			})
		}
	},
};

export default ApplicationQuery;
