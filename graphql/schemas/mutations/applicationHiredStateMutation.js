import { inputInsertApplicationHiredState } from '../types/operations/insertTypes';
import { ApplicationHiredStateType } from '../types/operations/outputTypes';
import { inputUpdateApplicationHiredState } from '../types/operations/updateTypes';
import { GraphQLList } from 'graphql';
import moment from 'moment';
import { generateCSVFile } from '../../../Utilities/CSVManagement';
import { uploadbyFTP } from '../../../Utilities/FTPManagement';

import Db from '../../models/models';

const fs = require('fs');

const formatDate = date => {
	try {
		return date ? moment(date).format('L') : '';
	} catch (error) {
		return '';
	}
}

const genderName = gender => !gender ? '' : gender === 1 ? 'M' : 'F';

const employeeTypeName = type => !type ? '' : type === 'Full-Time' ? 'FT' : 'PT';

/**
 * Genera un reporte en formato CSV de los empleados nuevos en el dia
 */
export const dailyEmployeeReport = () => {
	const currentDate = new Date();
	const startDate = moment(currentDate).subtract(1, "days").format('MM/DD/YYYY HH:mm:ss');
	const endDate = moment(currentDate).format('MM/DD/YYYY HH:mm:ss');

	Db.models.ApplicationHiredStates.findAll(
		{
			where: {
				hiredStateId: 4,
				createdAt: { $between: [startDate, endDate] },
				isActive: true
			},
			include:[{
				model: Db.models.Applications,
				required: true,
				include: [{
					model: Db.models.Employees,
					required: true,
					include: [{
						model: Db.models.CatalogItem,
						as: 'CatalogDepartment'
					}, {
						model: Db.models.EmployeeByHotels,
						required: false,
						where: { isDefault: true, isActive: true },
						include: [{
							model: Db.models.BusinessCompany,
							as: 'BusinessCompanies'
						}]
					}]
				}]
			}]
		}
	).then(applications => {
		try {
			const csvData = applications.map(async item => {
				if(!item.dataValues) return null;
	
				const {Application} = item.dataValues;
				const app = Application ? Application.dataValues : {};
				const employee = app.Employees && app.Employees.length ? app.Employees[0].dataValues : {};
				const department = employee.CatalogDepartment ? employee.CatalogDepartment.dataValues : {};
				const employeeByHotels = employee.EmployeeByHotels && employee.EmployeeByHotels.length ? employee.EmployeeByHotels[0].dataValues : {};
				const homeLocation = employeeByHotels.BusinessCompanies ? employeeByHotels.BusinessCompanies.dataValues : {};
				const cityFound = app.city 
										? await Db.models.CatalogItem.find({where: {Id: app.city}}).then(ci => ci ? ci.dataValues : {}) 
										: {};
				const stateFound = app.state 
										? await Db.models.CatalogItem.find({where: {Id: app.state}}).then(st => st ? st.dataValues : {}) 
										: {};

				return {
					"Co": '',
					"Last": app.lastName,
					"First": app.firstName,
					"Middle": app.middleName,
					"Address 1": app.streetAddress,
					"Address 2": '',
					"City": cityFound.Name || '',
					"State": stateFound.Name || '',
					"Zip": app.zipCode,
					"SSN": app.socialSecurityNumber,
					"DOB": formatDate(app.birthDay),
					"Gender": genderName(app.gender),
					"FT/PT": employeeTypeName(app),
					"Hire Date": formatDate(employee.hireDate),
					"Department": department.DisplayLabel || '', //app.Employee.Id_Deparment
					"Location": homeLocation.Name || '',
					"Rate": '',
					"Salary": '',
					"Hours": '',
					"Frequency": '',
					"Tax": '',
					"TaxWork State": '',
					"Email": app.emailAddress,
					"Phone": app.homePhone,
					"Cell": app.cellPhone
				}
			});
	

			Promise.all(csvData).then(completedData => {
				generateCSVFile('testCSV.csv', completedData).then(filePath => {
					const ftpFileName = `NewEmployess(${moment(currentDate).format('MM-DD-YYYY')}).csv`;
					uploadbyFTP(filePath, ftpFileName).then(res => {
						fs.unlink(filePath);
					});
				});
			});
	
		} catch (error) {
			console.log(error);
		}
	});
}

const ApplicationHiredStateMutation = {
	addApplicationHiredState: {
		type: new GraphQLList(ApplicationHiredStateType),
		description: 'Add ApplicationHiredState to database',
		args: {
			applicationHiredStates: { type: new GraphQLList(inputInsertApplicationHiredState) }
		},
		resolve(source, args) {
			return Db.models.ApplicationHiredStates.bulkCreate(args.applicationHiredStates, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateApplicationHiredState : {
		type: ApplicationHiredStateType,
		description: 'Update ApplicationHiredState',
		args: {
			applicationHiredState: { type: inputUpdateApplicationHiredState }
		},
		resolve(source, args) {
			return Db.models.ApplicationHiredStates
				.update(args.applicationHiredState,
					{
						where: { id: args.applicationHiredState.id },
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default ApplicationHiredStateMutation;
