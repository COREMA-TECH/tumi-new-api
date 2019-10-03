import { GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import { PunchesReportConsolidateType, ApprovePunchesType } from '../types/operations/outputTypes';
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
const NOW_DESCRIPTION = "Now";
const Op = Sequelize.Op;

const getDuration = (_startTime, _endTime) => {
    let startTime = moment.utc(_startTime, 'HH:mm:ss');//Get Start Time
    let endTime = moment.utc(_endTime, 'HH:mm:ss');//Get End Time
    let duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
    let diff = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float
    return !isNaN(parseFloat(diff)) ? parseFloat(diff) : 0;
}

const getWorkedTime = (data) => {
    let workedTime = 0.00;
    data.map(_det => {
        let currentMark = _det;
        let startTime = '00:00';
        let endTime = '24:00';
        let prevMark = data.find(_this => _this.markedDate === currentMark.markedDate && _this.markedTime < currentMark.markedTime);
        let nextMark = data.find(_this => _this.markedDate === currentMark.markedDate && _this.markedTime > currentMark.markedTime);

        //Set initial start and end time
        startTime = currentMark.markedTime;
        if (nextMark) endTime = nextMark.markedTime;

        // If this mark is Clockout and prevMark doesnt exist calculate based on 00:00
        if (currentMark.typeMarkedId === CLOCKOUT && !prevMark)
            endTime = currentMark.markedTime;
        else if (currentMark.typeMarkedId !== CLOCKOUT) {
            //There is an enter to work or enter to lunch MARK but not and out of work MARK
            if (`${CLOCKIN}|${BREAKIN}`.includes(currentMark.typeMarkedId) && !nextMark)
                startTime = currentMark.markedTime; //endTime = 24:00
        }
        workedTime = ((parseFloat(workedTime) + getDuration(startTime, endTime)) * 1.00).toFixed(2);
        if (!nextMark) workedTime = ((parseFloat(workedTime) - (workedTime > 4 ? 0.5 : 0)) * 1.00).toFixed(2);
    })
    return workedTime;
}

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
            if (!["employee", "startDate", "endDate", "idEntity", "Id_Deparment", "EmployeeId"].join().includes(prop))
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

    if (filter.EmployeeId) newFilter = { ...newFilter, EmployeeId: filter.EmployeeId }

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
            EmployeeId: { type: GraphQLInt }
        },
        resolve(args) {
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
                order: [
                    ['EmployeeId', 'DESC'],
                    ['entityId', 'DESC'],
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
                                    required: true,
                                    where: Sequelize.where(Sequelize.fn('upper', Sequelize.fn("concat", Sequelize.col("firstName"), ' ', Sequelize.col("lastName"))), {
                                        $like: `%${args.employee.toUpperCase()}%`
                                    })
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
            }).then(marks => {
                return;
                var key = "", localGroupKey = "";
                var groupKey = [];
                var employee;
                var punch = {};

                const punches = marks.map(mark => {

                    let { EmployeeId, markedDate, entityId, positionId, inboundMarkImage, outboundMarkTime } = mark.dataValues;

                    employee = mark.dataValues.Employees.dataValues;
                    let application = employee.ApplicationEmployee.Application.dataValues;
                    let name = `${application.firstName} ${application.lastName}`.trim();
                    let company = mark.dataValues.BusinessCompany.dataValues;
                    
                    key = `${entityId}-${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}`;
                    
                    localGroupKey = `${moment.utc(markedDate).format('YYYYMMDD')}`;
                    if (!groupKey.includes(localGroupKey))
                        groupKey = [...groupKey, localGroupKey];

                    punch = {
                        key,
                        localGroupKey,
                        name,
                        employeeId: EmployeeId,
                        job: positionId,
                        hotelCode: company.Name,
                        hotelId: company.Id,
                        imageMarkedIn: inboundMarkImage,
                        imageMarkedOut: outboundMarkTime,
                        clockIn:inboundMarkTime,
                        clockOut: moment.utc(markedDate).format('YYYY/MM/DD') == moment.utc(new Date()).format('YYYY/MM/DD') ? NOW_DESCRIPTION : "24:00",
                        duration: 0
                    }
                    return punch;
                });


                let newPunches = {};

                groupKey.forEach((group) => {
                    newPunches[group] = punches.filter(punch => {
                        return punch.localGroupKey === group
                    });
                });

                let _punches = [];

                for (const key in newPunches) {
                    if (newPunches.hasOwnProperty(key)) {
                        _punches.push({
                            key,
                            punches : newPunches[key]
                        });
                    }
                }
                
                return _punches;//Return list of punches
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
        resolve(args) {
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
                            where: {
                                $and: [
                                    { directDeposit: args.directDeposit },
                                    Sequelize.where(Sequelize.fn('upper', Sequelize.fn("concat", Sequelize.col("firstName"), ' ', Sequelize.col("lastName"))), {
                                        $like: `%${args.employee.toUpperCase()}%`
                                    })]
                            }
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


                            /**
                             *
                             */


                            return '/public/' + 'output-' + random.substring(0, 5) + '.csv'; //Return the filename - path

                        })
                })
        }
    },
    approvePunchesReport: {
        type: GraphQLList(ApprovePunchesType),
        description: "Get Punches report",
        args: {
            idEmployee: { type: GraphQLInt },
            status: { type: new GraphQLNonNull(GraphQLString) },
            startDate: { type: new GraphQLNonNull(GraphQLDate) },
            endDate: { type: new GraphQLNonNull(GraphQLDate) },
        },
        resolve(args) {
            let filter = {};

            //------------------Create filters
            //Filter by date range
            if (args.startDate && args.endDate)
                filter = {
                    ...filter,
                    $and: [
                        { markedDate: { $gte: new Date(args.startDate.setUTCHours(0, 0, 0)) } },
                        { markedDate: { $lte: new Date(args.endDate.setUTCHours(23, 59, 59)) } }]
                };

            //Filter by status
            if (args.status !== "W")
                if (args.status === "A")
                    filter = { ...filter, approvedDate: { $ne: null } };
                else filter = { ...filter, approvedDate: { $is: null } };

            if (args.idEmployee)
                filter = { ...filter, EmployeeId: args.idEmployee };

            //------------------Return query
            return Db.models.MarkedEmployees.findAll(
                {
                    where: filter,
                    include: [{
                        model: Db.models.Employees,
                        as: "Employees",
                        required: true,
                        include: [{
                            model: Db.models.ApplicationEmployees,
                            required: true,
                            include: [{
                                model: Db.models.Applications,
                                as: "Application",
                                required: true
                            }]
                        }]
                    }],
                    order: [
                        ['EmployeeId', 'DESC'],
                        ['entityId', 'DESC'],
                        ['markedDate', 'ASC'],
                        ['markedTime', 'ASC']
                    ],
                }
            )
                .then(_ => {
                    let employees = [];
                    _.map(mark => {
                        let { EmployeeId, Employees, approvedDate, id, typeMarkedId, markedDate, markedTime } = mark.dataValues;
                        let { ApplicationEmployee } = Employees.dataValues;
                        let { Application } = ApplicationEmployee.dataValues;
                        let employee = employees.find(emp => emp.id === EmployeeId);
                        if (!employee) {
                            employee = { id: EmployeeId, approvedWorkedTime: 0.00, unapprovedWorkedTime: 0.00, fullName: `${Application.firstName} ${Application.lastName}`, detailApproved: [], detailUnapproved: [] };
                            employees.push(employee);
                        }
                        if (approvedDate)
                            employee.detailApproved.push({ id, typeMarkedId, markedDate, markedTime });
                        else employee.detailUnapproved.push({ id, typeMarkedId, markedDate, markedTime });
                    })
                    //Calculte total worked total hours by date and status
                    employees.map(_emp => {
                        _emp.unapprovedWorkedTime = getWorkedTime(_emp.detailUnapproved);
                        _emp.approvedWorkedTime = getWorkedTime(_emp.detailApproved);
                        _emp.approvedDate = _emp.detailApproved.length === 0 ? 'never approved' : _emp.detailApproved.sort((a, b) => b.markedDate.localeCompare(a.markedDate))[0].markedDate
                    })
                    // console.log(employees)
                    return employees.sort((a, b) => a.fullName.localeCompare(b.fullName));
                })
        }
    }
};

export default MarkedEmployeesConsolidated;