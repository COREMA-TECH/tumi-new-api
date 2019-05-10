import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { PunchesReportType } from '../types/operations/outputTypes';
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
        type: new GraphQLList(PunchesReportType),
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
                    model: Db.models.BusinessCompany,
                    where: { ...getPunchesCompanyFilter(args) },
                    required: true
                }]
            })
                .then(marks => {
                    var objPunches = {};
                    marks.map(_mark => {
                        var { typeMarkedId, markedTime, EmployeeId, notes, markedDate, imageMarked } = _mark.dataValues;

                        var markType = '30570||30571'.includes(typeMarkedId) ? '001' : '002';//ClockIn||ClockOut (001), otherwise '002'
                        var key = `${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}-${markType}`;
                        var groupKey = `${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        var shift = _mark.dataValues.Shift.dataValues;
                        var position = shift.CatalogPosition.dataValues;
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
                                job: markType == '002' ? 'Lunch Break' : position.Position,
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
                            } else {
                                let _punch = objPunches[groupKey].punches.find(p => { return p.key == key });
                                if (!_punch)
                                    objPunches[groupKey].punches.push(punch);
                                else punch = _punch;
                            }
                            //Format punche time
                            var hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');
                            //Update marker type hour based on type and hour
                            switch (typeMarkedId) {
                                case 30570 || 30572: //Clock In//Break In
                                    punch.clockIn = hour;
                                    punch.imageMarkedIn = imageMarked;
                                    break;
                                case 30571 || 30573://Clock Out//Break Out
                                    punch.clockOut = hour;
                                    punch.imageMarkedOut = imageMarked;
                                    break;
                            }
                        }

                    })

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