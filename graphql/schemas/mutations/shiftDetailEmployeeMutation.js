import { inputInsertShiftDetailEmployee } from '../types/operations/insertTypes';
import { ShiftDetailEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const ShiftDetailEmployeeMutation = {
    addShiftDetailEmployee: {
        type: ShiftDetailEmployeesType,
        description: 'Add Shift Detail Employee to database',
        args: {
            ShiftDetailEmployee: { type: inputInsertShiftDetailEmployee },
            openShift: { type: GraphQLBoolean }
        },
        resolve(source, args) {
            if (args.openShift)
                return Db.models.ShiftDetailEmployees.create(args.ShiftDetailEmployee);
            else
                return Db.models.ShiftDetailEmployees.update(args.ShiftDetailEmployee,
                    { where: { ShiftDetailId: args.ShiftDetailEmployee.ShiftDetailId }, returning: true })
                    .then(function ([rowsUpdate, [record]]) {
                        if (record) return record.dataValues;
                        else return null;
                    });
        }
    }
};

export default ShiftDetailEmployeeMutation;
