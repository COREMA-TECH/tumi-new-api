import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';

const ApplicationPhaseQuery = {
    application_phase: {
        type: new GraphQLList(ApplicationPhaseType),
        description: 'List Application by Phases records',
        args: {
            id: {
                type: GraphQLList(GraphQLInt)
            },
            UserId: {
                type: GraphQLInt
            },
            ReasonId: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            },
            StageId: {
                type: GraphQLInt
            },
            WorkOrderId: {
                type: GraphQLInt
            },
            Comment: {
                type: GraphQLString
            },
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({ where: args });
        }
    }
};

export default ApplicationPhaseQuery;