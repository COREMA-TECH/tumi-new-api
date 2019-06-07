import { inputInsertTransactionLogType } from '../types/operations/insertTypes';
import { transactionLogsTypes } from '../types/operations/outputTypes';

import Db from '../../models/models';



const TransactionLogMutation = {
	addTransactionLog: {
		type: transactionLogsTypes,
		description: 'Add transaction logs record to database',
		args: {
			transactionlogs: { type: inputInsertTransactionLogType }
		},
		resolve(source, args) {
			return Db.models.TransactionLogs.create(args.transactionlogs);
		}
	}
	
};

export default TransactionLogMutation;
