import { GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLString } from 'graphql';
import { ApplicationHiredStateType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const ApplicationHiredStateQuery = {
    applicationHiredStates: {
        type: new GraphQLList(ApplicationHiredStateType),
        description: "Get applicationHiredStates list",
        args: {
            id: {
                type: GraphQLInt
            },
            applicationId: {
                type: GraphQLInt
            },
            hiredStateId: {
                type: GraphQLInt
            },
            origin: {
                type: GraphQLString
            },
            userCreated: {
                type: GraphQLInt
            },
            userUpdated: {
                type: GraphQLInt
            },
            isActive: {
                type: GraphQLBoolean
            }
        },
		resolve(root, args) {
			return Db.models.ApplicationHiredStates.findAll({ 
                where: args
            });
		}
    }
}

export default ApplicationHiredStateQuery;