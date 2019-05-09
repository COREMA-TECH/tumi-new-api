import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { ApplicationEmployeesType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const applicationEmployeesQuery = {
    applicationEmployees: {
        type: new GraphQLList(ApplicationEmployeesType),
        description: 'List employees records',
        args: {
            id: {
                type: GraphQLInt
            },
            ApplicationId:{
                type: GraphQLInt
            },
            EmployeeId:{
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.ApplicationEmployees.findAll({ where: args });
        }
    }
};

export default applicationEmployeesQuery;
