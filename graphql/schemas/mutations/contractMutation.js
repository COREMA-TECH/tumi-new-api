import { inputInsertContracts } from '../types/operations/insertTypes';
import { inputUpdateContracts } from '../types/operations/updateTypes';
import { ContractType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const ContractMutation = {
    addContract: {
        type: new GraphQLList(ContractType),
        description: 'Add contract to database',
        args: {
            contracts: { type: new GraphQLList(inputInsertContracts) }
        },
        resolve(source, args) {
            return Db.models.Contracts.bulkCreate(args.contracts, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateContract: {
        type: ContractType,
        description: 'Update Contract Record',
        args: {
            contract: { type: inputUpdateContracts }
        },
        resolve(source, args) {
            return Db.models.Contracts
                .update(
                        args.contract,
                    {
                        where: {
                            id: args.contract.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    }
};

export default ContractMutation;
