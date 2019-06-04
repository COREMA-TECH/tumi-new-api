import { inputInsertApplicationAccount, inputInsertApplicationAccountDocument } from '../types/operations/insertTypes';
import { ApplicationAccountType } from '../types/operations/outputTypes';

import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

const ApplicationAccountMutation = {
    addApplicationAccount: {
        type: ApplicationAccountType,
        description: 'Insert new Application Account',
        args: {
            applicationAccount: { type: inputInsertApplicationAccount },
            applicationAccountDocs: { type: new GraphQLList(inputInsertApplicationAccountDocument)}
        },
        resolve(source, args) {

            return Db.transaction( t => {
                return Db.models.ApplicationAccount.create(args.applicationAccount, {returning: true, transaction: t})
                    .then((data) => {
                        const docs = args.applicationAccountDocs.map(item => {
                            return {
                                applicationAccountId: data.dataValues.id,
                                path: item.path,
                                name: item.name,
                                extension: item.extension
                            }
                        });
                        Db.models.ApplicationAccountDocument.bulkCreate(docs, {returning: true}).catch(error => console.log(error));
                });
            });
		}
    }
};

export default ApplicationAccountMutation;