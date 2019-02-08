import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicationPhaseType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const timeElapsedQuery = {
    timeElapsed: {
        type: new GraphQLList(ApplicationPhaseType),
        description: 'List of Phases',
        args: {
            ShiftId: {
                type: GraphQLInt
            },
            UserId: {
                type: GraphQLInt
            },
            StageId: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({
                where: args,
                /* include: [
                     /*{
                         model: Db.models.Shift,
                         where: {
                             id: args.ShiftId
                         }
                     },
                     {
                     model: Db.models.Application,
                     where: {
                         id: args.ApplicationId
                     }
                 }
                 ],*/
                order: [['createdAt', 'DESC']]
            });
        }
    }
};

export default timeElapsedQuery;
