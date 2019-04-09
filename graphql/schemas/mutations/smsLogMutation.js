import { inputInsertSmsLogType } from '../types/operations/insertTypes';
import { inputUpdateSmsLogType } from '../types/operations/updateTypes';
import { SmsLogType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';

import Db from '../../models/models';

const SmsLogMutation = {
    addSmsLog: {
        type: new GraphQLList(SmsLogType),
        description: 'Add SmsLog to database',
        args: {
            smsLog: { type: new GraphQLList(inputInsertSmsLogType) }
        },
        resolve(source, args) {
            return Db.models.SMSLog.bulkCreate(args.smsLog, { returning: true }).then((ret) => {
                return ret.map((data) => {
                    return data.dataValues;
                });
            });
        }
    },
    updateSmsLog: {
        type: SmsLogType,
        description: 'Update SmsLog Info',
        args: {
            smsLog: { type: inputUpdateSmsLogType }
        },
        resolve(source, args) {
            return Db.models.SMSLog
                .update(args.smsLog,
                    {
                        where: {
                            id: args.smsLog.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    },
};

export default SmsLogMutation;
