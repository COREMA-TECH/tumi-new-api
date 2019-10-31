import { inputInsertSmsLogType } from '../types/operations/insertTypes';
import { inputUpdateSmsLogType } from '../types/operations/updateTypes';
import { SmsLogType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import Sequelize from 'sequelize';

import Db from '../../models/models';
//import { SendSMS } from '../../../Configuration/Roots';
import { sendSMSApi } from '../../../Utilities/SMSManagement';

const Op = Sequelize.Op;


const SmsLogMutation = {
    addSmsLog: {
        type: new GraphQLList(SmsLogType),
        description: 'Add SmsLog to database',
        args: {
            smsLog: { type: new GraphQLList(inputInsertSmsLogType) }
        },
        resolve(source, args) {
            return Db.models.SMSLog.bulkCreate(args.smsLog, { returning: true }).then((ret) => {
                return ret.map((data) => {
                    return data.dataValues;
                });
            });
        }
    },
    updateSmsLog: {
        type: SmsLogType,
        description: 'Update SmsLog Info',
        args: {
            smsLog: { type: inputUpdateSmsLogType }
        },
        resolve(source, args) {
            return Db.models.SMSLog
                .update(args.smsLog,
                    {
                        where: {
                            id: args.smsLog.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    },
    updateShiftBasedOnSMSRequest: {
        type: SmsLogType,
        description: 'This method is used to update SMS Log Request and ShiftDetail/ Acept o Reject Schedule',
        args: {
            number: { type: GraphQLString },
            response: { type: GraphQLString }
        },
        resolve(source, args) {
            const rejectMessage = 'NO';
            //Update SMS Log with SMS response
            return Db.models.SMSLog.update({ response: args.response },
                { where: { number: args.number, response: null }, returning: true })
                .then(([rowsUpdate, [_smsLog]]) => {
                    //verify if the sms log has been updated with the sms response
                    if (_smsLog) {
                        let { ShiftId, EmployeeId } = _smsLog.dataValues;
                        //Get Shift Detail to be updated (Rejected or Accepted by the employee)
                        return Db.models.ShiftDetail.findAll({
                            where: { ShiftId, status: { [Op.in]: [0, 1] } },
                            include: [{
                                model: Db.models.ShiftDetailEmployees,
                                required: true,
                                where: { EmployeeId }
                            }]
                        }).then(_shiftDetails => {
                            _shiftDetails.map(_shiftDetail => {
                                //By default color and status is accepted 
                                let status = 2, color = '#4f9959',
                                    id = _shiftDetail.dataValues.id, shiftDetailEmployee = _shiftDetail.dataValues.ShiftDetailEmployee.dataValues;
                                //if the respnse is NO , then set reject color and status (Opening)
                                if (args.response.toUpperCase() == rejectMessage.toUpperCase())
                                    status = 0, color = '#96989A';
                                //Update ShiftDetail record
                                return Db.models.ShiftDetail.update(
                                    { status, color },
                                    { where: { id } })
                                    .then(ret => {

                                        //Detele Employee relation when reponse is NO
                                        if (args.response.toUpperCase() == rejectMessage.toUpperCase())
                                            return Db.models.ShiftDetailEmployees.destroy(
                                                { where: shiftDetailEmployee.id }
                                            ).then(_shiftDetailemployee => {
                                                return _smsLog;
                                            })
                                        else {
                                            console.log({
                                                msg: "Congratulations!! The Job is yours!!",
                                                number: _smsLog.dataValues.number
                                            })
                                            sendSMSApi({
                                                msg: "Congratulations!! The Job is yours!!",
                                                number: _smsLog.dataValues.number
                                            });

                                            return Db.models.SMSLog.findAll({
                                                where: {
                                                    id: { [Op.ne]: _smsLog.dataValues.id },
                                                    response: null,
                                                    ShiftId: _smsLog.dataValues.ShiftId
                                                }
                                            }).then(_auto => {
                                                _auto.map((_rejected) => {
                                                    console.log({
                                                        msg: "This Job is not available anymore.",
                                                        number: _rejected.number
                                                    });
                                                    sendSMSApi({
                                                        msg: "This Job is not available anymore.",
                                                        number: _rejected.number
                                                    });
                                                })
                                                //Update Log
                                                return Db.models.SMSLog.update({ response: "ACCEPTED BY ANOTHER PERSON" },
                                                    {
                                                        where: {
                                                            id: { [Op.ne]: _smsLog.dataValues.id },
                                                            response: null,
                                                            ShiftId: _smsLog.dataValues.ShiftId
                                                        }, returning: true
                                                    })
                                                    .then(() => {
                                                        return _smsLog;
                                                    })
                                            })

                                        };
                                    })
                            })
                            return _smsLog;
                        })

                    }
                })
        }

    }
};

export default SmsLogMutation;
