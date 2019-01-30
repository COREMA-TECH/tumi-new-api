import { inputInsertUser } from '../types/operations/insertTypes';
import { inputUpdateUser } from '../types/operations/updateTypes';
import { UserType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const UserMutation = {
    addHoliday: {
        type: new GraphQLList(UserType),
        description: 'Add user to database',
        args: {
            user: { type: inputInsertUser }
        },
        resolve(source, args) {
            return Db.models.Users.create(args.holidays)
        }
    }
}
export default UserMutation;