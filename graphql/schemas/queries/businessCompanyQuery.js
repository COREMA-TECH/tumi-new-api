import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { BusinessCompanyType } from '../types/operations/outputTypes';
import Db from '../../models/models';

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
        type: new GraphQLList(BusinessCompanyType),
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
                }]
            }).then(ret => {
                let employeesByProperties = [];
                let BusinessCompanyObj = {};
                ret.map(BusinessCompany => {
                    BusinessCompanyObj = {
                        code: BusinessCompany.dataValues.Code,
                        name: BusinessCompany.dataValues.Name,
                        Employees: []
                    };

                    BusinessCompany.Employees.map(Employee => {
                        if (Employee.dataValues) {
                            BusinessCompanyObj.Employees.push({
                                id: Employee.dataValues.id,
                                name: Employee.dataValues.firstName + " " + Employee.dataValues.lastName,
                                position: Employee.dataValues.PositionRate ? Employee.dataValues.PositionRate.dataValues.Position: 'N/A',
                                los: 0,
                                phone: Employee.dataValues.mobileNumber
                            });
                        }
                    });

                    employeesByProperties.push(BusinessCompanyObj);

                });
                console.log(employeesByProperties)
            });
        }
    }
};

export default businessCompanyQuery;
