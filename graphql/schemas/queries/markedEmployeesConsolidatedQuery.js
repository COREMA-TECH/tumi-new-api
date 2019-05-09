import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { PunchesReportConsolidateType } from '../types/operations/outputTypes';
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
            var punches = [];
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
                include: [{
                    model: Db.models.Employees,
                    where: { ...getPunchesEmployeeFilter(args) },
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
                        var { id, entityId, typeMarkedId, markedDate, markedTime, imageMarked, EmployeeId } = _mark.dataValues;
                        var key = `${EmployeeId}-${moment.utc(markedDate).format('YYYYMMDD')}`;
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
                                date: moment.utc(markedDate).format('YYYY/MM/DD'),
                                hotelCode: company.Code,
                                positionCode: position.Position,
                                imageMarked
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
                    var punches = [];
                    Object.keys(objPunches).map(i => {
                        var punche = objPunches[i];//Get Punche Object
                        var startTime = moment.utc(punche.clockIn, 'HH:mm:ss');//Get Start Time
                        var endTime = moment.utc(punche.clockOut, 'HH:mm:ss');//Get End Time
                        var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                        var workedTime = ((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2);//Calulate duration in minutes/float

                        punche.hoursWorked = !isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0; //Update worked time

                        var employee = args.employee || '';

                        if (punche.name.trim().toUpperCase().includes(employee.trim().toUpperCase()))
                            punches.push(punche);//Return new object

                    });
                    return punches;//Return list of punches
                })
        }
    }
};

export default MarkedEmployeesConsolidated;