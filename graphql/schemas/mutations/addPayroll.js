import {insertPayrollType} from '../types/operations/insertTypes';
import models from '../../../models';

const addPayroll = {
    addPayroll: {
        type: insertPayrollType,
        description: 'Add payroll record to database',
        args: {
            payroll: {
                type: insertPayrollType
            }
        },
        resolve(source, args) {
            return models.Payroll
                .create(args.payroll, {returning: true})
                .then((output) => {
                    return output.map((element) => {
                        return element.dataValues;
                    });
                });
        }
    },

};

export default addPayroll;
