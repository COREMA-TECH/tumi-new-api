import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { MarkedEmployeesType, PunchesReportType } from '../types/operations/outputTypes';
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

const MarkedEmployeesConsolidateQuery = {
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
    markedEmployeesConsolidate: {
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
            var punchesConsolidate = [];
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
                }/*, {
                    model: Db.models.BusinessCompany,
                    where: { ...getPunchesCompanyFilter(args) },
                    required: true, 
                    order: [
                        ['id', 'DESC'],
                    ],
                }*/]
            })
                .then(marks => {
                    var objPunches = {};
                    marks.map(_mark => {
                        var { id, entityId, typeMarkedId, markedDate, markedTime, imageMarked, EmployeeId, ShiftId, flag } = _mark.dataValues;
                        var key = `${EmployeeId}-${moment(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        var shift = _mark.dataValues.Shift.dataValues;
                        var position = shift.CatalogPosition.dataValues;
                       
                        //Create new punch object if this object doesnt exist into the array of punches
                        if (!objPunches[key]) {
                            var reportRow = {
                                employeeId: EmployeeId,
                                name: `${employee.firstName} ${employee.lastName}`,
                                hourCategory: '01Reg',
                                hoursWorked: 0,
                                payRate: position.Pay_Rate,
                                date: moment(markedDate).format('YYYY/MM/DD'),
                                hotelCode: 'Generic',//company.Code,
                                positionCode: position.Position,
                            }
                            objPunches = { ...objPunches, [key]: reportRow }
                        }
                        //Format punche time
                        var hour = moment.utc(markedTime, 'HH:mm').format('HH:mm');
                        //Update marker type hour based on type and hour
                        switch (typeMarkedId) {
                            case 30570: //Clock In
                                objPunches[key] = { ...objPunches[key], clockIn: hour, imageMarkedIn: imageMarked, flagMarkedIn: flag, idMarkedIn: id };
                                break;
                            case 30571://Clock Out
                                objPunches[key] = { ...objPunches[key], clockOut: hour, imageMarkedOut: imageMarked, flagMarkedOut: flag, idMarkedOut: id };
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
                    var markedEmployeesConsolidate = [];
                    var workedTime ;
                    var employee ;
                    var Id_Employees = 0;
                    var Old_Id_Employees = 0;
                    var _workedTime=0;

                    Object.keys(objPunches).map(i => {
                       
                        var punchesConsolidate = objPunches[i];//Get Punche Object

                        Id_Employees = punchesConsolidate.employeeId;
                        _workedTime = 0;
                        Object.keys(objPunches).map(j => {
                            var _punchesConsolidate = objPunches[j];//Get Punche Object
                            
                            var startTime = moment.utc(_punchesConsolidate.clockIn, 'HH:mm:ss');//Get Start Time
                            var endTime = moment.utc(_punchesConsolidate.clockOut, 'HH:mm:ss');//Get End Time
                            var duration = moment.duration(endTime.diff(startTime));//Calculate duration between times
                         
                            workedTime = parseFloat(((duration.hours() + (duration.minutes() / 60)) * 1.00).toFixed(2));//Calulate duration in minutes/float

                            if(Id_Employees==_punchesConsolidate.employeeId)
                            {
                            _workedTime = parseFloat(_workedTime + (!isNaN(parseFloat(workedTime)) ? parseFloat(workedTime) : 0 )); 
                            }
                        });

                        employee = args.employee || '';                       
                        punchesConsolidate.hoursWorked =_workedTime; 

                        if (Old_Id_Employees!=0 && Old_Id_Employees!=Id_Employees)
                        {
                        if (punchesConsolidate.name.trim().toUpperCase().includes(employee.trim().toUpperCase()))
                            markedEmployeesConsolidate.push(punchesConsolidate);//Return new object                        
                        }
                        Old_Id_Employees=Id_Employees;
                    });

                    return markedEmployeesConsolidate;//Return list of punches
                })
        }
    }
};

export default MarkedEmployeesConsolidateQuery;
