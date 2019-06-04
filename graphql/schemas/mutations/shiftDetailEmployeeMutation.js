import { inputInsertShiftDetailEmployee } from '../types/operations/insertTypes';
import { ShiftDetailEmployeesType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLBoolean, GraphQLInt } from 'graphql';

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
    },
    addShiftDetailEmployeeForSerie: {
        type: new GraphQLList(ShiftDetailEmployeesType),
        description: 'Add/update shift detail employee for serie edition',
        args: {
            ShiftId: { type: GraphQLInt },
            ShiftDetailId: { type: GraphQLInt },
            EmployeeId: { type: GraphQLInt }
        },
        resolve(source, args) {
            //This is a specific ShifDetail
            if (args.ShiftId == 0)
                //Verify if shiftDetailEmployee exists
                return Db.models.ShiftDetailEmployees.findAll({ where: { ShiftDetailId: args.ShiftDetailId } })
                    .then(_ => {
                        if (_.length == 0)
                            return Db.models.ShiftDetailEmployees.create({ ShiftDetailId: args.ShiftDetailId, EmployeeId: args.EmployeeId });
                        else
                            return Db.models.ShiftDetailEmployees.update({ EmployeeId: args.EmployeeId }, { where: { ShiftDetailId: args.ShiftDetailId } });
                    })
            //Edit a serie
            else {
                //Delete relation between ShiftDetail and ShiftDetailEmployee
                return Db.models.ShiftDetail.findAll({ where: { ShiftId: args.ShiftId } })
                    .then(_ => {
                        let ids = [];
                        _.map(_record => {
                            ids.push(_record.dataValues.id)
                        })
                        return Db.models.ShiftDetailEmployees.destroy({ where: { id: { $in: ids } } })
                            .then(_shiftDetail => {
                                let recordsToInsert = [];
                                ids.map(i => {
                                    recordsToInsert.push({ ShiftDetailId: i, EmployeeId: args.EmployeeId })
                                })
                                return Db.models.ShiftDetailEmployees.bulkCreate(recordsToInsert)
                            })
                    })
            }

        }
    }
};

export default ShiftDetailEmployeeMutation;
