import { insertPayrollType } from '../types/operations/insertTypes';
import models from '../../../models';
import { listPayrollType } from "../types/operations/outputTypes";
import { updatePayrollType } from "../types/operations/updateTypes";
import Db from '../../models/models';
import moment from 'moment';

/**
 * Payroll mutation with two operation, create a new payroll or update an existing payroll
 * @type {{updatePayroll: {}, addPayroll: {args: {payroll: {type}}, resolve(*, *): *, description: string, type}}}
 */
const payrollMutation = {
    addPayroll: {
        type: listPayrollType,
        description: 'Add payroll record to database',
        args: {
            payroll: {
                type: insertPayrollType
            }
        },
        resolve(source, args) {
            return models.Payroll.create(args.payroll, { returning: true }).then((output) => {
                let lastPayPeriod = output.dataValues.lastPayPeriod;
                let lastPayPeriodDate = moment(lastPayPeriod);
            });
        }
    },
    updatePayroll: {
        type: listPayrollType,
        description: 'Update a payroll record to database',
        args: {
            payroll: {
                type: updatePayrollType
            }
        },
        resolve(source, args) {
            return models.Payroll
                .update(
                    {
                        weekStart: args.payroll.weekStart,
                        payPeriod: args.payroll.payPeriod,
                        lastPayPeriod: args.payroll.lastPayPeriod,
                    },
                    {
                        where: {
                            id: args.payroll.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    }
};

export default payrollMutation;
