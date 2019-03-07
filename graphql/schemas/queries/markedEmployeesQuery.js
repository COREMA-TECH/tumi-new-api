import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { MarkedEmployeesType, PunchesReportType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import { isNumber } from 'util';

const MarkedEmployeesQuery = {
    markedEmployees: {
        type: new GraphQLList(MarkedEmployeesType),
        description: 'List employees records',
        args: {
            id: {
                type: GraphQLInt
            },
            typeMarkedId: {
                type: GraphQLInt
            },
            markedDate: {
                type: GraphQLDate
            },
            markedTime: {
                type: GraphQLString
            },
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({ where: args });
        }
    },
    punches: {
        type: new GraphQLList(PunchesReportType),
        description: "Get Punches report",
        resolve(root, args) {
            var punches = [];
            return Db.models.MarkedEmployees.findAll({
                include: [{
                    model: Db.models.Employees,
                    as: 'Employees',
                    required: true
                }, {
                    model: Db.models.Shift,
                    required: true,
                    include: [{
                        model: Db.models.PositionRate,
                        as: 'CatalogPosition',
                        required: true
                    }]
                }, {
                    model: Db.models.BusinessCompany,
                    required: true
                }]
            })
                .then(marks => {
                    var objPunches = {};
                    marks.map(_mark => {
                        var { id, entityId, typeMarkedId, markedDate, markedTime, imageMarked, EmployeeId, ShiftId } = _mark.dataValues;
                        var key = `${entityId}-${EmployeeId}-${ShiftId}-${moment(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        var shift = _mark.dataValues.Shift.dataValues;
                        var position = shift.CatalogPosition.dataValues;
                        var company = _mark.dataValues.BusinessCompany.dataValues;

                        //Create new punch object if this object doesnt exist into the array of punches
                        if (!objPunches[key]) {
                            var reportRow = {
                                employeeId: EmployeeId,
                                name: `${employee.firstName} ${employee.lastName}`,
                                hourCategory: '01Reg',
                                hoursWorked: 0,
                                payRate: position.Pay_Rate,
                                date: moment(markedDate).format('YYYY/MM/DD'),
                                hotelCode: company.Code,
                                positionCode: position.Position
                            }
                            objPunches = { ...objPunches, [key]: reportRow }
                        }
                        //Format punche time
                        var hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');
                        //Update marker type hour based on type and hour
                        switch (typeMarkedId) {
                            case 30570: //Clock In
                                objPunches[key] = { ...objPunches[key], clockIn: hour };
                                break;
                            case 30571://Clock Out
                                objPunches[key] = { ...objPunches[key], clockOut: hour };
                                break;
                            case 30572://Break In
                                objPunches[key] = { ...objPunches[key], lunchIn: hour };
                                break;
                            case 30573://Break Out
                                objPunches[key] = { ...objPunches[key], lunchOut: hour };
                                break;
                        }
                    })

                    //Create array of punches based on object structure
                    var punches = Object.keys(objPunches).map(i => {
                        var punche = objPunches[i];//Get Punche Object
                        var startTime = moment.utc(punche.clockIn, 'HH:mm:ss');//Get Start Time
                        var endTime = moment.utc(punche.clockOut, 'HH:mm:ss');//Get End Time
                        var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                        var workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                        punche.hoursWorked = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time

                        return punche;//Return new object

                    });

                    return punches;//Return list of punches
                })
        }
    }
};

export default MarkedEmployeesQuery;
