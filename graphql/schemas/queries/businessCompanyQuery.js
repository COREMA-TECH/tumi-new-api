import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { BusinessCompanyType, employeesByPropertiesType } from '../types/operations/outputTypes';
import { inputInsertBusinessCompany } from '../types/operations/insertTypes';
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
            property: { type: inputInsertBusinessCompany },
            operationManagerId: { type: GraphQLInt }
        },
        resolve(root, args) {
            let whereProperty = { Id_Parent: { $notIn: [0, 99999] } };
            if (args.property)
                whereProperty = { ...whereProperty, ...args.property }

            return Db.models.BusinessCompany.findAll({
                where: { ...whereProperty },
                include: [{
                    model: Db.models.Employees,
                    include: [{
                        model: Db.models.PositionRate,
                        as: 'Title'
                    },
                    {
                        model: Db.models.ApplicationEmployees,
                        required: true,
                        include: [
                            {
                                model: Db.models.Applications,
                                as: "Application",
                                required: true
                            }
                        ]
                    }]
                }, {
                    model: Db.models.CatalogItem,
                    where: { Id_Catalog: 8, IsActive: 1 },
                    required: false
                }, {
                    model: Db.models.BusinessCompany,
                    as: 'CompanyParent'
                }]
            }).then(ret => {
                let employeesByProperties = [];
                let BusinessCompanyObj = {};

                let BusinessCompanyRegion = [];

                ret.map(BusinessCompany => {

                    let managementCompany = "N/A";

                    if (BusinessCompany.dataValues.CompanyParent)
                        managementCompany = BusinessCompany.dataValues.CompanyParent.dataValues.Code + '|' + BusinessCompany.dataValues.CompanyParent.dataValues.Name;

                    BusinessCompanyRegion.push(BusinessCompany.dataValues.Region);
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
                            workedDays = serverdate.diff(markedDate, 'days');
                        }

                        if (Employee.dataValues) {
                            let title = 'N/A';
                            if (Employee.dataValues.Title) {
                                title = Employee.dataValues.Title.dataValues ? Employee.dataValues.Title.dataValues.Position : 'N/A';
                            }
                            let application = Employee.dataValues.ApplicationEmployee.Application.dataValues;

                            BusinessCompanyObj.employees.push({
                                id: Employee.dataValues.id,
                                name: application.firstName + " " + application.lastName,
                                position: title,
                                los: workedDays,
                                phone: Employee.dataValues.mobileNumber,
                                startDate: markedDate
                            });
                        }
                    });

                    employeesByProperties.push(BusinessCompanyObj);

                });
                let userFilter = { IdRegion: BusinessCompanyRegion, Id_Roles: 3, IsActive: 1 };
                if (args.operationManagerId) {
                    userFilter = {
                        Id: args.operationManagerId
                    }
                }

                return Db.models.Users.findAll({ returning: true, where: userFilter }).then(users => {
                    let empProp = employeesByProperties;

                    if (args.operationManagerId) {
                        empProp = employeesByProperties.filter(employeesByProperty => {
                            return employeesByProperty.region === users[0].IdRegion
                        });
                    }

                    if (empProp.length > 0) {
                        empProp.map(employeesByProperty => {
                            users.map(user => {
                                employeesByProperty.operationManager = employeesByProperty.region === user.IdRegion ? user.firstName + " " + user.lastName : 'N/A';
                            });
                        });
                    }
                    return empProp;
                }).catch(error => console.log(error));

            }).catch(error => console.log(error));
        }
    }
};

export default businessCompanyQuery;
