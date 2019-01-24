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
    },
    printDate: {
        type: new GraphQLList(GraphQLDate),
        description: 'Print Date',
        args: {
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate }
        },
        resolve(root, args) {
            //Create dates to be inserted in ShiftDetail
            var currentDate = new Date(args.startDate);
            var list = [];

            while (currentDate <= args.endDate) {
                let newDate = new Date(currentDate)
                console.log(newDate, newDate.getDay())
                list.push(newDate)
                currentDate.setDate(currentDate.getDate() + 1)
            }
            return list;
        }
    }
};

export default ShiftQuery;
