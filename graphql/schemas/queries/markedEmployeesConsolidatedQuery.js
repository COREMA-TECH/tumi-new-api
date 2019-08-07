import { GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean } from 'graphql';
import { PunchesReportConsolidateType, PunchesConsolidatedForCSVType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import os from 'os';

const uuidv4 = require('uuid/v4');
const CLOCKIN = 30570;
const CLOCKOUT = 30571;
const BREAKIN = 30572;
const BREAKOUT = 30573;
const NOW_DESCRIPTION = "Now"
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
            if (!["employee", "startDate", "endDate", "idEntity", "Id_Deparment"].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
            else if (prop == "Id_Deparment")
                newFilter = { ...newFilter, [prop]: { $in: filter[prop] } };
    }
    return newFilter;
}
const getPunchesMarkerFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    let startDate = moment.utc(filter.startDate).local()._d;
    let endDate = moment.utc(filter.endDate).local()._d;

    if (filter.endDate && filter.startDate)
        newFilter = {
            ...newFilter,
            [Op.and]: [
                { markedDate: { [Op.gte]: startDate.setUTCHours(0, 0, 0) } },
                { markedDate: { [Op.lte]: endDate.setUTCHours(22, 59, 59) } }
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
                newFilter = { ...newFilter, Id: { $in: filter[prop] } };
    }
    return newFilter;
}

const MarkedEmployeesConsolidated = {
    markedEmployeesConsolidated: {
        type: new GraphQLList(PunchesReportConsolidateType),
        description: "Get Punches report",
        args: {
            idEntity: { type: new GraphQLList(GraphQLInt) },
            Id_Deparment: { type: new GraphQLList(GraphQLInt) },
            employee: { type: GraphQLString },
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate },
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
                order: [
                    ['EmployeeId', 'DESC'],
                    ['entityId', 'DESC'],
                    ['markedDate', 'ASC'],
                    ['markedTime', 'ASC']
                ],
                include: [{
                    model: Db.models.Employees,
                    where: { ...getPunchesEmployeeFilter(args) },
                    include: [
                        {
                            model: Db.models.ApplicationEmployees,
                            required: true,
                            include: [
                                {
                                    model: Db.models.Applications,
                                    as: "Application",
                                    required: true
                                }
                            ]
                        },
                        {
                            model: Db.models.EmployeeByHotels,
                            required: true,
                            include: [{
                                model: Db.models.BusinessCompany,
                                as: 'BusinessCompanies',
                                where: { ...getPunchesCompanyFilter(args) },
                                required: true
                            }]
                        }
                    ],
                    order: [
                        ['id', 'DESC'],
                    ],
                    as: 'Employees',
                    required: true
                },
                {
                    model: Db.models.BusinessCompany,
                    where: { ...getPunchesCompanyFilter(args) },
                    required: true
                }]
            })
                .then(marks => {
                    var objPunches = {};

                    for (var index = 0; index < marks.length; index++) {
                        let _mark = marks[index];

                        var { typeMarkedId, markedTime, EmployeeId, notes, markedDate, imageMarked, id, notes, entityId } = _mark.dataValues;

                        var key = `${entityId}-${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var groupKey = `${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        // var shift = _mark.dataValues.Shift.dataValues;
                        // var position = shift.CatalogPosition.dataValues;
                        let company = _mark.dataValues.BusinessCompany.dataValues;
                        let punch = {};

                        var employeeName = args.employee || '';
                        let application = employee.ApplicationEmployee.Application.dataValues;
                        let name = `${application.firstName} ${application.lastName}`.trim();
                        //Filter employee based on filter param
                        if (name.toUpperCase().includes(employeeName.trim().toUpperCase())) {
                            //Create punch record
                            punch = {
                                key,
                                name,
                                employeeId: EmployeeId,
                                job: '',
                                hotelCode: company.Name,
                                hotelId: company.Id,
                                clockOut: moment.utc(markedDate).format('YYYY/MM/DD') == moment.utc(new Date()).format('YYYY/MM/DD') ? NOW_DESCRIPTION : "24:00"
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
                                punch.clockInId = id;
                                punch.noteIn = notes;

                                let nextMark = marks[index + 1];
                                if (nextMark) {
                                    let _nextMarkValues = nextMark.dataValues;
                                    var _nextMarkHour = moment.utc(_nextMarkValues.markedTime, 'HH:mm').format('HH:mm');

                                    if (_nextMarkValues.EmployeeId == _mark.EmployeeId &&
                                        moment.utc(_nextMarkValues.markedDate).local().format("YYYYMMDDD") == moment.utc(_mark.markedDate).local().format("YYYYMMDDD") &&
                                        _nextMarkValues.entityId == _mark.entityId) {
                                        punch.clockOut = _nextMarkHour;
                                        punch.imageMarkedOut = _nextMarkValues.imageMarked;
                                        punch.clockOutId = _nextMarkValues.id;
                                        punch.noteOut = notes;
                                        if (_nextMarkValues.typeMarkedId == BREAKOUT && typeMarkedId == BREAKIN)
                                            punch.job = 'Lunch Break'
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
                            var workedTime = (duration.asHours() * 1.00).toFixed(2)//((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                            _punch.duration = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time
                        })
                        punchesConsolidated.push(punche);
                    });
                    if (punchesConsolidated.length > 0)
                        punchesConsolidated = punchesConsolidated.sort((a, b) => b.key - a.key)//Sort descending
                    return punchesConsolidated;//Return list of punches
                })
        }
    },
    markedEmployeesConsolidatedForCSV: {

        type: GraphQLString,
        description: "Get Punches report",
        args: {
            idEntity: { type: new GraphQLList(GraphQLInt) },
            Id_Deparment: { type: new GraphQLList(GraphQLInt) },
            employee: { type: GraphQLString },
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate },
            directDeposit: { type: GraphQLBoolean }
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args), typeMarkedId: { $in: [CLOCKIN, CLOCKOUT] } },
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
                    required: true,
                    include: [{
                        model: Db.models.CatalogItem,
                        as: 'CatalogDepartment'
                    },
                    {
                        model: Db.models.PositionRate,
                        as: 'Title'
                    },
                    {
                        model: Db.models.ApplicationEmployees,
                        required: true,
                        include: [{
                            model: Db.models.Applications,
                            as: 'Application',
                            required: true,
                            where: { directDeposit: args.directDeposit }
                        }]
                    },
                    {
                        model: Db.models.EmployeeByHotels,
                        required: true,
                        include: [{
                            model: Db.models.BusinessCompany,
                            as: 'BusinessCompanies',
                            where: { ...getPunchesCompanyFilter(args) },
                            required: true
                        }]
                    }]
                },
                {
                    model: Db.models.BusinessCompany,
                    where: { ...getPunchesCompanyFilter(args) },
                    required: true
                }]
            })
                .then(marks => {

                    let data = [], companyIds = [];
                    marks.map(_ => {
                        let mark = _.dataValues;
                        let department = mark.Employees.dataValues.CatalogDepartment;
                        let titleObj = mark.Employees.dataValues.Title, payRate, title;
                        let company = _.BusinessCompany.dataValues;
                        let weekNumber = moment.utc(mark.markedDate).isoWeek();
                        let groupKey = `${mark.entityId}-${mark.EmployeeId}-${weekNumber}`;
                        let key = `${mark.entityId}-${mark.EmployeeId}-${moment.utc(mark.markedDate).format('YYYYMMDD')}`;
                        let hour = moment.utc(mark.markedTime, 'HH:mm').format('HH:mm');
                        let punch = {};

                        department = department ? department.dataValues.DisplayLabel.trim() : '';
                        title = titleObj ? titleObj.dataValues.Position.trim() : '';
                        payRate = titleObj ? titleObj.dataValues.Pay_Rate : 0;

                        punch = {
                            key,
                            employeeId: mark.EmployeeId,
                            hourCategory: '01Reg',
                            hoursWorked: 0,
                            lunchDeduction: 0,
                            payRate,
                            dateIn: moment.utc(mark.markedDate).format('MM/DD/YYYY'),
                            dateOut: moment.utc(mark.markedDate).format('MM/DD/YYYY'),
                            clockIn: '00:00',
                            clockOut: '24:00',
                            hotelCode: company.Code,
                            departmentCode: department,
                            positionCode: title,
                            idCompanyParent: company.Id_Parent
                        }
                        //Save Company Id to query company preferences
                        if (!companyIds.find(i => i == company.Id_Parent))
                            companyIds.push(company.Id_Parent)

                        if (!data[groupKey]) {
                            var reportRow = {
                                entityId: mark.entityId,
                                employeeId: mark.EmployeeId,
                                weekNumber,
                                punches: [punch]
                            }
                            data = { ...data, [groupKey]: reportRow }
                        }
                        else {
                            let _punch = data[groupKey].punches.find(p => { return p.key == key });
                            if (!_punch)
                                data[groupKey].punches.push(punch);
                            else punch = _punch;
                        }
                        //Update marker type hour based on type and hour
                        if (mark.typeMarkedId == CLOCKIN) {
                            punch.clockIn = hour;
                            punch.dateIn = moment.utc(mark.markedDate).format('MM/DD/YYYY');
                        }
                        else if (mark.typeMarkedId == CLOCKOUT) {
                            punch.clockOut = hour;
                            punch.dateOut = moment.utc(mark.markedDate).format('MM/DD/YYYY');
                        }

                    })

                    // Create array of punches based on object structure to calculate duration
                    var punchesCSV = [];
                    Object.keys(data).map(i => {

                        let punche = data[i];//Get Punche Object
                        let totalWorkedbyWeek = 0;//More than 40 hours is Extra time
                        let lastPunch;

                        punche.punches.map(_punch => {
                            var startTime = moment.utc(_punch.clockIn, 'HH:mm:ss');//Get Start Time
                            var endTime = moment.utc(_punch.clockOut, 'HH:mm:ss');//Get End Time
                            var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                            var workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                            _punch.hoursWorked = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time
                            totalWorkedbyWeek += _punch.hoursWorked;
                            lastPunch = _punch;

                            if (_punch.hoursWorked > 1) _punch.hoursWorked = _punch.hoursWorked - 0.5;//Substract lunch

                            //Add this punch to array of punches
                            punchesCSV.push(_punch);

                        })

                        //Add extra time record
                        if (totalWorkedbyWeek > 40)
                            punchesCSV.push({
                                key: lastPunch.key,
                                employeeId: lastPunch.employeeId,
                                hourCategory: '02OT',
                                hoursWorked: totalWorkedbyWeek - 40,
                                lunchDeduction: '',
                                payRate: lastPunch.payRate,
                                dateIn: lastPunch.dateIn,
                                clockIn: '',
                                dateOut: lastPunch.dateOut,
                                clockOut: '',
                                hotelCode: lastPunch.hotelCode,
                                departmentCode: lastPunch.departmentCode,
                                positionCode: lastPunch.positionCode,
                                idCompanyParent: lastPunch.idCompanyParent
                            })

                    })
                    //Set lunch deduction to every record in case of apply to it
                    return Db.models.CompanyPreferences.findAll({
                        where: { EntityId: { $in: companyIds }, charge: true }
                    })
                        .then(_ => {
                            //Get table records only
                            let preferences = _.map(item => {
                                return item.dataValues
                            })
                            //Go throug every record in report to calculate lunch deduction
                            punchesCSV.map(_ => {
                                //Get lunch dedudction record
                                let preference = preferences.find(item => item.EntityId == _.idCompanyParent)
                                //Set lunch deduction only for more than 4 hours worked and exclude extra time records
                                if (_.hoursWorked > 4 && preference && _.hourCategory != '02OT')
                                    _.lunchDeduction = preference.time;
                            })
                            /**
                     *
                     * @type {string}
                     */
                            let mainPath = path.dirname(require.main.filename);

                            // random string
                            let random = uuidv4();

                            // output file in the same folder
                            const filename = path.join(mainPath + '/public/', 'output-' + random.substring(0, 5) + '.csv'); // TODO: test url
                            const output = []; // holds all rows of data

                            punchesCSV.forEach((d) => {
                                // a new array for each row of data
                                const row = [];

                                row.push(d.employeeId);
                                row.push('E');
                                row.push(d.hourCategory);
                                row.push(d.hoursWorked);
                                row.push(d.lunchDeduction);
                                row.push(d.payRate);
                                row.push('');
                                row.push(`${d.dateIn} ${d.clockIn}`);
                                row.push(`${d.dateOut} ${d.clockOut}`);
                                row.push('');
                                row.push('');
                                row.push(d.hotelCode);
                                row.push(d.departmentCode);
                                row.push(d.positionCode);

                                output.push(row.join()); // by default, join() uses a ','
                            });

                            fs.writeFileSync(filename, output.join(os.EOL));

                            console.clear();
                            console.log("----------------------------------------------------------------------------");
                            console.log("Filename ----> ", filename.toString());


                            let pathname = filename.toString();
                            /**
                             *
                             */


                            return '/public/' + 'output-' + random.substring(0, 5) + '.csv'; //Return the filename - path

                        })
                })
        }
    }
};

export default MarkedEmployeesConsolidated;