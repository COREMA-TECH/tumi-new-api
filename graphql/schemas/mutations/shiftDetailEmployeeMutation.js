import { inputInsertShiftDetailEmployee } from '../types/operations/insertTypes';
import { ShiftDetailEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const ShiftDetailEmployeeMutation = {
    addShiftDetailEmployee: {
        type: ShiftDetailEmployeesType,
        description: 'Add Shift Detail Employee to database',
        args: {
            ShiftDetailEmployee: { type: inputInsertShiftDetailEmployee }
        },
        resolve(source, args) {
            if (args.ShiftDetailEmployee.EmployeeId != 0)
                return Db.models.ShiftDetailEmployees.create(args.ShiftDetailEmployee);
        }
    }
};

export default ShiftDetailEmployeeMutation;
