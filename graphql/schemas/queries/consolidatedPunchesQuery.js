import {GraphQLInt, GraphQLObjectType, GraphQLString} from 'graphql';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import Sequelize from 'sequelize';
import fs from 'fs';
import path from 'path';
import os from 'os';
import {getCSVURLType} from "../types/operations/outputTypes";

const Op = Sequelize.Op;

const getPunchesEmployeeFilter = (filter) => {
    let newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (let prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
        //Exclude startDate and endDate from filters
            if (!["employee", "startDate", "endDate", "idEntity"].join().includes(prop))
                newFilter = {...newFilter, [prop]: filter[prop]};
    }
    return newFilter;
};

const getPunchesMarkerFilter = (filter) => {
    let newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    if (filter.endDate && filter.startDate)
        newFilter = {
            ...newFilter,
            [Op.and]: [
                {markedDate: {[Op.gte]: filter.startDate}},
                {markedDate: {[Op.lte]: filter.endDate.setUTCHours(23, 59, 59)}}
            ]
        };

    return newFilter;
};

const getPunchesCompanyFilter = (filter) => {
    let newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough each filter
    for (let prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
        //Only filter by idEntity
            if (prop == "idEntity")
                newFilter = {...newFilter, Id: filter[prop]};
    }

    return newFilter;
};

const PunchesEmployeesQuery = {
    punchesConsolidated: {
        type: GraphQLString,
        description: "Get Punches csv",
        args: {
            idEntity: {type: GraphQLInt},
            Id_Department: {type: GraphQLInt},
            employee: {type: GraphQLString},
            startDate: {type: GraphQLDate},
            endDate: {type: GraphQLDate},
        },
        resolve(root, args) {
            let punches = [];
            return Db.models.MarkedEmployees.findAll({
                where: {...getPunchesMarkerFilter(args)},
                include: [{
                    model: Db.models.Employees,
                    where: {...getPunchesEmployeeFilter(args)},
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
                    where: {...getPunchesCompanyFilter(args)},
                    required: true
                }]
            })
                .then(marks => {
                    let objPunches = {};
                    marks.map(_mark => {
                        let {id, entityId, typeMarkedId, markedDate, markedTime, imageMarked, EmployeeId, ShiftId, flag} = _mark.dataValues;
                        let key = `${entityId}-${EmployeeId}-${ShiftId}-${moment(markedDate).format('YYYYMMDD')}`;
                        let employee = _mark.dataValues.Employees.dataValues;
                        let shift = _mark.dataValues.Shift.dataValues;
                        let position = shift.CatalogPosition.dataValues;
                        let company = _mark.dataValues.BusinessCompany.dataValues;

                        //Create new punch object if this object doesnt exist into the array of punches
                        if (!objPunches[key]) {
                            let reportRow = {
                                employeeId: EmployeeId,
                                name: `${employee.firstName} ${employee.lastName}`,
                                hourCategory: '01Reg',
                                hoursWorked: 0,
                                payRate: position.Pay_Rate,
                                date: moment(markedDate).format('YYYY/MM/DD'),
                                hotelCode: company.Code,
                                positionCode: position.Position,
                            }
                            objPunches = {...objPunches, [key]: reportRow}
                        }
                        //Format punche time
                        let hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');
                        //Update marker type hour based on type and hour
                        switch (typeMarkedId) {
                            case 30570: //Clock In
                                objPunches[key] = {
                                    ...objPunches[key],
                                    clockIn: hour,
                                    imageMarkedIn: imageMarked,
                                    flagMarkedIn: flag,
                                    idMarkedIn: id
                                };
                                break;
                            case 30571://Clock Out
                                objPunches[key] = {
                                    ...objPunches[key],
                                    clockOut: hour,
                                    imageMarkedOut: imageMarked,
                                    flagMarkedOut: flag,
                                    idMarkedOut: id
                                };
                                break;
                            case 30572://Break In
                                objPunches[key] = {...objPunches[key], lunchIn: hour};
                                break;
                            case 30573://Break Out
                                objPunches[key] = {...objPunches[key], lunchOut: hour};
                                break;
                        }
                    });

                    //Create array of punches based on object structure
                    let punches = [];
                    Object.keys(objPunches).map(i => {
                        let punche = objPunches[i];//Get Punche Object
                        let startTime = moment.utc(punche.clockIn, 'HH:mm:ss');//Get Start Time
                        let endTime = moment.utc(punche.clockOut, 'HH:mm:ss');//Get End Time
                        let duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                        let workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                        punche.hoursWorked = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time

                        let employee = args.employee || '';

                        if (punche.name.trim().toUpperCase().includes(employee.trim().toUpperCase()))
                            punches.push(punche);//Return new object

                    });

                    /**
                     *
                     * @type {string}
                     */
                    let mainPath = path.dirname(require.main.filename);

                    // output file in the same folder
                    const filename = path.join(mainPath + '/public/', 'output.csv'); // TODO: test url
                    const output = []; // holds all rows of data

                    const row = [];
                    row.push("Employee ID");
                    row.push("Name");
                    row.push("Hour Category");
                    row.push("hoursWorked");
                    row.push("Pay Rate");
                    row.push("Date");
                    row.push("Clock In");
                    row.push("Clock Out");
                    row.push("Lunch In");
                    row.push("Lunch Out");
                    row.push("Hotel Code");
                    row.push("Position Code");
                    row.push("Image Marked In");
                    row.push("Image Marked Out");
                    row.push("Flag Marked In");
                    row.push("FlagMarkedOut");
                    row.push("Id Marked In");
                    row.push("Id Marked Out");

                    output.push(row.join())

                    punches.forEach((d) => {
                        // a new array for each row of data
                        const row = [];

                        row.push(d.employeeId);
                        row.push(d.name);
                        row.push(d.hourCategory);
                        row.push(d.hoursWorked);
                        row.push(d.payRate);
                        row.push(d.date);
                        row.push(d.clockIn);
                        row.push(d.clockOut);
                        row.push(d.lunchIn);
                        row.push(d.lunchOut);
                        row.push(d.hotelCode);
                        row.push(d.positionCode);
                        row.push(d.imageMarkedIn);
                        row.push(d.imageMarkedOut);
                        row.push(d.flagMarkedIn);
                        row.push(d.flagMarkedOut);
                        row.push(d.idMarkedIn);
                        row.push(d.idMarkedOut);

                        output.push(row.join()); // by default, join() uses a ','
                    });

                    fs.writeFileSync(filename, output.join(os.EOL));

                    console.clear();
                    console.log("------------------------------------------------------------------------------------------------");
                    console.log("Filename ----> ", filename.toString());


                    let pathname = filename.toString();
                    /**
                     *
                     */


                    return '/public/' + 'output.csv'; //Return the filename - path
                })
        }
    }
};

export default PunchesEmployeesQuery;
