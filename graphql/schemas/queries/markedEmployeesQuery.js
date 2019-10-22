import { GraphQLList, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { MarkedEmployeesType, PunchesReportType, TimeMarkType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import moment from 'moment';
import Sequelize from 'sequelize';
import { SendSMS } from '../../../Configuration/Roots';


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

    marks: {
        type: new GraphQLList(MarkedEmployeesType),
        description: "Lists all marks",
        args: {
            id: {
                type: GraphQLInt
            },
            inboundMarkTypeId: {
                type: GraphQLInt
            },
            outboundMarkTypeId: {
                type: GraphQLInt
            },
            markedDate: {
                type: GraphQLDate
            },
            inboundMarkTime: {
                type: GraphQLString
            },
            outboundMarkTime: {
                type: GraphQLString
            },
        },

        resolve(_, args) {
            return Db.models.MarkedEmployees.findAll({ where: args });
        }
    },

    mark: {
        type: TimeMarkType,
        description: "Find a mark",
        args: {
            id: {
                type: new GraphQLNonNull(GraphQLInt)
            },
        },

        resolve(_, args) {
            return Db.models.MarkedEmployees.findOne({ where: args });           
        }
    },

    previousMark: {
        type: MarkedEmployeesType,
        description: "Find matching time mark",
        args: {
            entityId: { type: GraphQLInt },
            EmployeeId: { type: new GraphQLNonNull(GraphQLInt) },
            markedDate: { type: new GraphQLNonNull(GraphQLString) },            
        },

        async resolve(_, args){
            const found = await Db.models.MarkedEmployees.findAll({
                limit: 1,
                where: args,
                order: [
                    ['inboundMarkTime', "DESC"]
                ]
            });

            return found[0];
        }
    },

    activeEmployeesByMarks: {
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
            EmployeeId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            let dateParam = {};

            if (args)
                dateParam = args;

            dateParam = {
                ...dateParam,
                markedDate: {
                    $gt: moment(Date.now()).subtract(2, "week").toDate()
                }
            }
            return Db.models.MarkedEmployees.findAll({ where: dateParam });
        }
    },
    punchesDetails: {
        type: new GraphQLList(MarkedEmployeesType),
        description: 'List punches by employees and date',
        args: {
            EmployeeId: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.MarkedEmployees.findAll({
                where: args,
                order: [
                    ['markedDate', 'DESC'],
                    ['markedTime', 'ASC']
                ],
                include: [{
                    model: Db.models.Employees,
                    as: 'Employees',
                    required: true,
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
                            model: Db.models.ShiftDetailEmployees,
                            required: true,
                            include: [{
                                model: Db.models.ShiftDetail,
                                required: true,
                                include: [{
                                    model: Db.models.Shift,
                                    required: true,
                                    include: [{
                                        model: Db.models.ShiftWorkOrder,
                                        required: true
                                    }]
                                }]
                            }]
                        }]
                }, {
                    model: Db.models.CatalogItem,
                    as: 'CatalogMarked',
                    required: true
                }, {
                    model: Db.models.BusinessCompany,
                    required: true
                }]
            }).then(markedEmployees => {
                let details = {};
                let CurrentMarkedDate = '', x = 0;
                markedEmployees.map(markedEmployee => {
                    var markedDate = markedEmployee.dataValues.markedDate;
                    var key = `${moment(markedDate).format('YYYYMMDD')}`;
                    if (CurrentMarkedDate != key) {
                        let application = markedEmployee.dataValues.Employees.dataValues.ApplicationEmployee.Application.dataValues;
                        details[key] = {
                            id: markedEmployee.dataValues.id,
                            date: markedEmployee.dataValues.markedDate,
                            Employee: application.firstName,
                            Location: markedEmployee.dataValues.BusinessCompany.dataValues.State
                        };
                        details[key].time = [];
                        details[key].time.push({
                            mark: markedEmployee.dataValues.markedTime,
                            typeMarkedId: markedEmployee.dataValues.markedTime,
                            typeMarkedName: markedEmployee.dataValues.CatalogMarked.dataValues.Value
                        });
                    } else {
                        details[key].time.push({
                            mark: markedEmployee.dataValues.markedTime,
                            typeMarkedId: markedEmployee.dataValues.markedTime,
                            typeMarkedName: markedEmployee.dataValues.CatalogMarked.dataValues.Value
                        });
                    }
                    CurrentMarkedDate = key;
                });
            });
        }
    },
    punches: {
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
            var punches = [];
            return Db.models.MarkedEmployees.findAll({
                where: { ...getPunchesMarkerFilter(args) },
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
                        }
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
                        var { id, entityId, typeMarkedId, markedDate, markedTime, imageMarked, EmployeeId, ShiftId } = _mark.dataValues;
                        var key = `${entityId}-${EmployeeId}-${ShiftId}-${moment.utc(markedDate).format('YYYYMMDD')}`;
                        var employee = _mark.dataValues.Employees.dataValues;
                        var shift = _mark.dataValues.Shift.dataValues;
                        var position = shift.CatalogPosition.dataValues;
                        var company = _mark.dataValues.BusinessCompany.dataValues;

                        //Create new punch object if this object doesnt exist into the array of punches
                        if (!objPunches[key]) {
                            let application = employee.ApplicationEmployee.Application.dataValues;
                            var reportRow = {
                                employeeId: EmployeeId,
                                name: `${application.firstName} ${application.lastName}`,
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
    },
    smsTest: {
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
            SendSMS({
                msg: "hola",
                number: "+17322070986"
            });
        }
    }
};

export default MarkedEmployeesQuery;
