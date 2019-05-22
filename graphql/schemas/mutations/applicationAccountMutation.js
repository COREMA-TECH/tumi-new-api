import { inputInsertApplicationAccount } from '../types/operations/insertTypes';
import { ApplicationAccountType } from '../types/operations/outputTypes';

import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';

const ApplicationAccountMutation = {
    addApplicationAccount: {
        type: ApplicationAccountType,
        description: 'Insert new Application Account',
        args: {
			applicationAccount: { type: inputInsertApplicationAccount }
        },
        resolve(source, args) {
			console.log("Variables de la application ", args)
			return Db.models.ApplicationAccount.create(args.applicationAccount);
		}
    }
};

export default ApplicationAccountMutation;