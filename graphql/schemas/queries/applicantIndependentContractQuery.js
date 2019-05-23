import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicantIndepenentContractType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ApplicantIndependentContractQuery = {
    applicantIndependentContract: {
        type: new GraphQLList(ApplicantIndepenentContractType),
        description: 'List application Independent Contract',
        args: {
            id: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.ApplicantIndependentContract.findAll({
                where: args,
                order: [['id', 'DESC']]
            });
        }
    }
};

export default ApplicantIndependentContractQuery;
