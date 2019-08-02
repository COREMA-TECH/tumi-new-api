import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { inputUpdateContracts } from '../types/operations/updateTypes';
import { ContractType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ContractQuery = {
    contracts: {
        type: new GraphQLList(ContractType),
        description: 'Contract list',
        args: {
            contract: { type: inputUpdateContracts }
        },
        resolve(root, args) {
            return Db.models.Contracts.findAll({ 
                where: args
            });
        }
    }
};

export default ContractQuery;
