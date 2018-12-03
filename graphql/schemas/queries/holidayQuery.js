import { GraphQLInt, GraphQLList } from 'graphql';
import { HolidayType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const HolidayQuery = {
    holidays: {
        type: new GraphQLList(HolidayType),
        description: 'List skills of Holidays',
        args: {
            id: {
                type: GraphQLInt
            },
            CompanyId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.Holiday.findAll({ where: args });
        }
    }
};

export default HolidayQuery;
