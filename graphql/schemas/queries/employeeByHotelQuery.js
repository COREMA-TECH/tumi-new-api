import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';
import { EmployeeByHotelType, BusinessCompanyType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const EmployeeByHotelQuery = {
    EmployeeByHotels: {
        type: new GraphQLList(EmployeeByHotelType),
        description: 'List employee by hotel',
        args: {
            id: {
                type: GraphQLInt
            },
            EmployeeId: {
                type: GraphQLInt
            },
            BusinessCompanyId: {
                type: GraphQLInt
            },
            createdAt: {
                type: GraphQLDate
            },
            updatedAt: {
                type: GraphQLDate
            },
            isDefault: {
                type: GraphQLBoolean
            },
            isActive:{
                type: GraphQLBoolean
            }
        },
        resolve(root, args) {
            return Db.models.EmployeeByHotels.findAll({ 
                where: args,
                include: [
                    {
                        model: Db.models.Employees,
                        as: 'Employees',
                        required: true
                    },
                    {
                        model: Db.models.BusinessCompany,
                        as: 'BussinessCompanies',
                        required: true
                    }
                ]
            });
        }
    }    
};

export default EmployeeByHotelQuery;
