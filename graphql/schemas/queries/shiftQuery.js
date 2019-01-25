import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { ShiftType } from '../types/operations/outputTypes';
import { inputShiftQuery } from '../types/operations/insertTypes';

import GraphQLDate from 'graphql-date';

import Db from '../../models/models';

const ShiftQuery = {
    shift: {
        type: new GraphQLList(ShiftType),
        description: 'List Shift records',
        args: {
            shift: { type: inputShiftQuery }
        },
        resolve(root, args) {
            return Db.models.Shift.findAll({ where: args.shift });
        }
    }
};

export default ShiftQuery;
