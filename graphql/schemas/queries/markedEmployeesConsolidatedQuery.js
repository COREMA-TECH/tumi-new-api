import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { PunchesReportConsolidateType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const CLOCKIN = 30570;
const CLOCKOUT = 30571;
const BREAKIN = 30572;
const BREAKOUT = 30573;


const getPunchesEmployeeFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
            //Exclude startDate and endDate from filters
            if (!["employee", "startDate", "endDate", "idEntity"].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
    }
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

const getPunchesCompanyFilter = (filter) => {
    var newFilter = {};
    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
            //Only filter by idEntity
            if (prop == "idEntity")
                newFilter = { ...newFilter, Id: filter[prop] };
    }
    return newFilter;
}

const MarkedEmployeesConsolidated = {
    markedEmployeesConsolidated: {
        type: new GraphQLList(PunchesReportConsolidateType),
        description: "Get Punches report",
        args: {
            idEntity: { type: GraphQLInt },
            Id_Department: { type: GraphQLInt },
            employee: { type: GraphQLString },
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate },
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
                order: [
                    ['EmployeeId', 'DESC'],
                    ['markedDate', 'ASC']
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
                    model: Db.models.BusinessCompany,
                    where: { ...getPunchesCompanyFilter(args) },
                    required: true
                }]
            })
                .then(marks => {
                    var objPunches = {};

                    for (var index = 0; index < marks.length; index++) {
                        let _mark = marks[index];

                        var { typeMarkedId, markedTime, EmployeeId, notes, markedDate, imageMarked } = _mark.dataValues;

                        var markType = '30570||30571'.includes(typeMarkedId) ? '001' : '002';//ClockIn||ClockOut (001), otherwise '002'
                        var key = `${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}-${typeMarkedId}`;
                        var groupKey = `${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        // var shift = _mark.dataValues.Shift.dataValues;
                        // var position = shift.CatalogPosition.dataValues;
                        let company = _mark.dataValues.BusinessCompany.dataValues;
                        let punch = {};

                        var employeeName = args.employee || '';
                        let name = `${employee.firstName} ${employee.lastName}`.trim();
                        //Filter employee based on filter param
                        if (name.toUpperCase().includes(employeeName.trim().toUpperCase())) {
                            //Create punch record
                            punch = {
                                key,
                                name,
                                employeeId: EmployeeId,
                                job: '',
                                hotelCode: company.Name
                            }
                            //Create new punch object if this object doesnt exist into the array of punches
                            if (!objPunches[groupKey]) {
                                var reportRow = {
                                    key: groupKey,
                                    date: moment.utc(markedDate).format('YYYY/MM/DD'),
                                    duration: 0,
                                    punches: [punch]
                                }
                                objPunches = { ...objPunches, [groupKey]: reportRow }
                            }
                            else {
                                //Exclude ClockOut mark from list
                                if (typeMarkedId != CLOCKOUT)
                                    objPunches[groupKey].punches.push(punch);
                            }

                            //Exclude ClockOut mark from list
                            if (typeMarkedId != CLOCKOUT) {

                                //Format punche time
                                var hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');

                                //Update marker type hour based on type and hour
                                //  if ("30570||30572".includes(typeMarkedId)) {
                                punch.clockIn = hour;
                                punch.imageMarkedIn = imageMarked;

                                let nextMark = marks[index + 1];
                                if (nextMark) {
                                    let _nextMarkValues = nextMark.dataValues;
                                    var _nextMarkHour = moment.utc(_nextMarkValues.markedTime, 'HH:mm').format('HH:mm');

                                    if (_nextMarkValues.EmployeeId == _mark.EmployeeId) {
                                        punch.clockOut = _nextMarkHour;
                                        punch.imageMarkedOut = _nextMarkValues.imageMarked;
                                        if (_nextMarkValues.typeMarkedId == BREAKOUT && typeMarkedId == BREAKIN)
                                            punch.job = 'Lunch Break'
                                    }
                                }

                            }

                        }
                    }

                    // Create array of punches based on object structure to calculate duration
                    var punchesConsolidated = [];
                    Object.keys(objPunches).map(i => {

                        var punche = objPunches[i];//Get Punche Object
                        punche.punches.map(_punch => {
                            var startTime = moment.utc(_punch.clockIn, 'HH:mm:ss');//Get Start Time
                            var endTime = moment.utc(_punch.clockOut, 'HH:mm:ss');//Get End Time
                            var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                            var workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                            _punch.duration = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time
                        })
                        punchesConsolidated.push(punche);

                    });


                    return punchesConsolidated;//Return list of punches
                })
        }
    }
};

export default MarkedEmployeesConsolidated;