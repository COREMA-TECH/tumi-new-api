import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { BusinessCompanyType, employeesByPropertiesType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import moment from 'moment';
import moment_tz from 'moment-timezone';

const businessCompanyQuery = {
    companiesByApplications: {
        type: new GraphQLList(BusinessCompanyType),
        description: 'List Companies records',
        args: {
            id: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.BusinessCompany.findAll({
                include: [{
                    model: Db.models.Contacts,
                    where: { IsActive: 1 },
                    required: true,
                    include: [{
                        model: Db.models.Applications,
                        required: true,
                        where: args
                    }]
                }]
            });
        }
    },
    employeesByProperties: {
        type: new GraphQLList(employeesByPropertiesType),
        description: 'List of employees by properties',
        args: {
            Id: { type: GraphQLInt }
        },
        resolve(root, args) {
            return Db.models.BusinessCompany.findAll({
                include: [{
                    model: Db.models.Employees,
                    include: [{
                        model: Db.models.PositionRate,
                        as: 'Title'
                    }]
                }, {
                    model: Db.models.CatalogItem,
                    where: { Id_Catalog: 8 }
                }, {
                    model: Db.models.BusinessCompany,
                    as: 'CompanyParent'
                }]
            }).then(ret => {
                let employeesByProperties = [];
                let BusinessCompanyObj = {};

                let BusinessCompanyId = [];

                ret.map(BusinessCompany => {

                    let managementCompany = "N/A";

                    if (BusinessCompany.dataValues.CompanyParent)
                        managementCompany = BusinessCompany.dataValues.CompanyParent.dataValues.Code + '|' + BusinessCompany.dataValues.CompanyParent.dataValues.Name;

                    BusinessCompanyId.push(BusinessCompany.dataValues.Region);
                    BusinessCompanyObj = {
                        id: BusinessCompany.dataValues.Id,
                        code: BusinessCompany.dataValues.Code,
                        name: BusinessCompany.dataValues.Name,
                        region: BusinessCompany.dataValues.Region,
                        count_associate: BusinessCompany.dataValues.Employees ? BusinessCompany.dataValues.Employees.length : 0,
                        count_department: BusinessCompany.dataValues.CatalogItems ? BusinessCompany.dataValues.CatalogItems.length : 0,
                        management_company: managementCompany,
                        employees: []
                    };

                    BusinessCompany.Employees.map(Employee => {
                        let workedDays = 0;
                        let markedDate = "N/A"
                        if (Employee.dataValues.hireDate) {
                            let serverdate = moment.utc(Date.now());
                            markedDate = moment.utc(Employee.dataValues.hireDate);
                            workedDays = serverdate.diff(markedDate,'days');
                        }

                        if (Employee.dataValues) {
                            BusinessCompanyObj.employees.push({
                                id: Employee.dataValues.id,
                                name: Employee.dataValues.firstName + " " + Employee.dataValues.lastName,
                                position: Employee.dataValues.PositionRate ? Employee.dataValues.PositionRate.dataValues.Position: 'N/A',
                                los: workedDays,
                                phone: Employee.dataValues.mobileNumber,
                                startDate: markedDate
                            });
                        }
                    });

                    employeesByProperties.push(BusinessCompanyObj);

                });

                return Db.models.Users.findAll({returning: true, where: { IdRegion: BusinessCompanyId } }).then(users => {
                    employeesByProperties.map(employeesByProperty => {
                        users.map(user => {
                            employeesByProperty.operationManager = employeesByProperty.region === user.IdRegion ? user.firstName + " " + user.lastName : 'N/A';
                        });
                    });
                    return employeesByProperties;
                }).catch(error => console.log(error));

            });
        }
    }
};

export default businessCompanyQuery;
