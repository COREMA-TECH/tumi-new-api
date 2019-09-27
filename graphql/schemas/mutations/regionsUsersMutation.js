import { inputInsertRegionsUsers } from '../types/operations/insertTypes';
import { inputUpdateRegionsUsers } from '../types/operations/updateTypes';
import { RegionsUsersType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const RegionsUsersMutation = {
    addRegionUser: {
        type: new GraphQLList(RegionsUsersType),
        description: 'Add Region by User relation',
        args: {
            regionsUsers: { type: new GraphQLList(inputInsertRegionsUsers) }
        },
        resolve(source, args) {
            return Db.models.RegionsUsers.bulkCreate(args.regionsUsers, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateRegionUser: {
        type: RegionsUsersType,
        description: 'Update Region by User relation',
        args: {
            regionUser: { type: inputUpdateRegionsUsers }
        },
        resolve(source, args) {

            return Db.models.RegionsUsers
                .update(
                        args.regionUser,
                    {
                        where: {
                            id: args.regionUser.id
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

export default RegionsUsersMutation;
