import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { ApplicationSummaryType} from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const ApplicationSummaryQuery = {
	applicationsSummary: {
		type: ApplicationSummaryType,
		description: 'List applications records',
		args: {
			id: {
				type: GraphQLInt
			}
		},
		resolve(root, args) {
			return Db.models.Applications.findOne({
                where: { ...args }
			}).then(_application => {
                
				var ApplicationSummary = {
					id: _application.dataValues.id,
                    firstName: _application.dataValues.firstName,
                    lastName: _application.dataValues.lastName,
                    middleName: _application.dataValues.middleName,
                    socialSecurityNumber:_application.dataValues.socialSecurityNumber,
                    homePhone:_application.dataValues.homePhone,
                    cellPhone: _application.dataValues.cellPhone,
                    birthDay: _application.dataValues.birthDay,
                    streetAddress: _application.dataValues.streetAddress,
                    city: _application.dataValues.city,
                    state: _application.dataValues.state,
                    zipCode: _application.dataValues.zipCode,
                    Hotel: '',
                    Department: '',
                    Job: '',
                    hiredDate: '',
                    Type: '',
                    payRate: '',
                    status: '',
                    numberDepartment: '',
                    recruiter:'',
                    directDepositAccount :  _application.dataValues.ApplicationAccounts == null ? '' : _application.dataValues.ApplicationAccounts.accountNumber,
                    bankName:  _application.dataValues.ApplicationAccounts == null ? '' : _application.dataValues.ApplicationAccounts.bankName,
                    routing:  _application.dataValues.ApplicationAccounts == null ? '' : _application.dataValues.ApplicationAccounts.routingNumber,
                    noID: '',
                    typeID: '',
                    expDate:'',
                    car:  _application.dataValues.car,
                    kids:  '',
                    area: _application.dataValues.area
				};
                return ApplicationSummary; //Return true when all record associated to this application are completed
                
			})
		}
	},
};

export default ApplicationSummaryQuery;
