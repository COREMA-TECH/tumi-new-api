import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { MarkedEmployeesType, PunchesReportDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const getPunchesEmployeeFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Validate if the filter has value
    if (filter.idUser)
        newFilter = { ...newFilter, idUsers: filter.idUser };
    return newFilter;
}
const getPunchesMarkerFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    if (filter.endDate && filter.startDate)
        newFilter = {
            ...newFilter,
            [Op.and]: [
                { markedDate: { [Op.gte]: filter.startDate } },
                { markedDate: { [Op.lte]: filter.endDate.setUTCHours(23, 59, 59) } }
            ]
        }
    return newFilter;
}

const MarkedEmployeesDetailQuery = {
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
    markedEmployeesDetail: {
        type: new GraphQLList(PunchesReportDetailType),
        description: "Get Punches report",
        args: {
            idUser: { type: GraphQLInt },
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate }
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
                order: [
                    ['EmployeeId', 'DESC'],
                ],
                include: [{
                    model: Db.models.Employees,
                    where: { ...getPunchesEmployeeFilter(args) },
                    order: [
                        ['id', 'DESC'],
                    ],
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
                    model: Db.models.BusinessCompany
                }]
            })
                .then(marks => {
                    var objPunches = {};
                    marks.map(_mark => {
                        var { typeMarkedId, markedTime, EmployeeId, notes, markedDate } = _mark.dataValues;

                        var markType = '30570||30571'.includes(typeMarkedId) ? '001' : '002';//ClockIn||ClockOut (001), otherwise '002'
                        var key = `${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}-${markType}`;
                        var groupKey = `${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        var shift = _mark.dataValues.Shift.dataValues;
                        var position = shift.CatalogPosition.dataValues;
                        let company = _mark.dataValues.BusinessCompany.dataValues;

                        //Create new punch object if this object doesnt exist into the array of punches
                        if (!objPunches[key]) {
                            var reportRow = {
                                key: groupKey,
                                employeeId: EmployeeId,
                                name: `${employee.firstName} ${employee.lastName}`,
                                date: moment.utc(markedDate).format('YYYY/MM/DD'),
                                duration: 0,
                                job: markType == '002' ? 'Lunch Break' : position.Position,
                                hotelCode: company.Name,
                                notes,
                            }
                            objPunches = { ...objPunches, [key]: reportRow }
                        }
                        //Format punche time
                        var hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');
                        //Update marker type hour based on type and hour
                        switch (typeMarkedId) {
                            case 30570 || 30572: //Clock In//Break In
                                objPunches[key] = { ...objPunches[key], clockIn: hour };
                                break;
                            case 30571 || 30573://Clock Out//Break Out
                                objPunches[key] = { ...objPunches[key], clockOut: hour };
                                break;
                        }
                    })


                    //Create array of punches based on object structure
                    var punches = [];
                    Object.keys(objPunches).map(i => {
                        var punche = objPunches[i];//Get Punche Object
                        var startTime = moment.utc(punche.clockIn, 'HH:mm:ss');//Get Start Time
                        var endTime = moment.utc(punche.clockOut, 'HH:mm:ss');//Get End Time
                        var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                        var workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                        punche.duration = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time

                        var employee = args.employee || '';

                        if (punche.name.trim().toUpperCase().includes(employee.trim().toUpperCase()))
                            punches.push(punche);//Return new object

                    });

                    //Create Punches Consolidated
                    var punchesConsolidated = [];
                    var oldKey = '';
                    var workedHours = 0;
                    punches.sort((a, b) => a.key > b.key).map(item => {
                        var { key, employeeId, name, date, duration, job, hotelCode, notes, clockIn, clockOut } = item;
                        //New Key, then insert object in the array
                        if (oldKey != item.key) {
                            punchesConsolidated.push({ key, employeeId, workedHours: duration, name, date, punches: [{ clockIn, clockOut, duration, job, hotelCode, notes }] });
                            oldKey = item.key;
                        } else {
                            var punchHeader = punchesConsolidated.find(elem => elem.key == key);

                            punchHeader.punches.push({ clockIn, clockOut, duration, job, hotelCode, notes });
                            punchHeader.workedHours += duration;
                        }
                    })

                    return punchesConsolidated;//Return list of punches
                })
        }
    }
};

export default MarkedEmployeesDetailQuery;
