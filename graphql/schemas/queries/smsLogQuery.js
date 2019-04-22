import { GraphQLList, GraphQLString, GraphQLInt, } from 'graphql';
import { SmsLogType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const SmsLogQuery = {
    smsLog: {
        type: new GraphQLList(SmsLogType),
        args: {
            number: {
                type: GraphQLString
            },
            EmployeeId: {
                type: GraphQLInt
            },
            ShiftId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.SMSLog.findAll({ where: args });
        }
    }
}

export default SmsLogQuery;