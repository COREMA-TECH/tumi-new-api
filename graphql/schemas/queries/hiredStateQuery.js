import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { HiredStateType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const HiredStateQuery = {
    hiredStates: {
        type: new GraphQLList(HiredStateType),
        description: "Get hiredStates list",
        args: {
            id: {
                type: GraphQLInt
            },
            order: {
                type: GraphQLInt
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
			return Db.models.HiredStates.findAll({ 
                where: args
            });
		}
    }
}

export default HiredStateQuery;