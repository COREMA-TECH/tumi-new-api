import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantW4Type } from '../types/operations/outputTypes';
import models from '../../../models/';
import Db from '../../models/models';

const ApplicantW4Query = {
    applicantW4: {
        type: new GraphQLList(ApplicantW4Type),
        description: 'List recruiters assigned to openings',
        args: {
            id: {
                type: GraphQLInt
            },
            recruiterId: {
                type: GraphQLInt
            },
            openingId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return models.OpeningRecruiter.findAll({
                where: args,
                include: [{
                    model: Db.models.Users
                }]
            });
        }
    }
};

export default ApplicantW4Query;
