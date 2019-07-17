import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLInputObjectType } from 'graphql';
import { ShiftType, WorkOrderType, shiftVsWorkedHoursType } from '../types/operations/outputTypes';
import { ShiftBoardType } from '../types/operations/outputTypes';
import { inputShiftQuery, inputShiftBoardCompany, inputQueryWorkOrder } from '../types/operations/insertTypes';


import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';
import Db from '../../models/models';
import moment from 'moment';

const Op = Sequelize.Op;

const GetWorkOrderFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
            //Exclude startDate and endDate from filters
            if (!['startDate', 'endDate', 'id'].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
    }
    //Create custom filter for startDate and endDate
    if (filter.startDate && filter.endDate)
        newFilter = {
            ...newFilter,
            [Op.and]: [{
                [Op.and]: [
                    { startDate: { [Op.gte]: filter.startDate } },
                    { startDate: { [Op.lte]: filter.endDate } }
                ]
            },
            {
                [Op.and]: [
                    { endDate: { [Op.gte]: filter.startDate } },
                    { endDate: { [Op.lte]: filter.endDate } }
                ]
            }]

        }
    //Create filter for column [id] whether is an integer column
    if (Number.isInteger(parseInt(filter.id)))
        newFilter = { ...newFilter, id: filter.id };

    return newFilter;
}

const GetShitEntityFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
            //Exclude startDate and endDate from filters
            if (prop != 'Code')
                newFilter = { ...newFilter, [prop]: filter[prop] };
        //Validate if the column to filter is the Code Column , and only filter whether is not an integer value

    }
    return newFilter;
}

const ShiftQuery = {
    shift: {
        type: new GraphQLList(ShiftType),
        description: 'List Shift records',
        args: {
            shift: { type: inputShiftQuery }
        },
        resolve(root, args) {
            return Db.models.Shift.findAll({ where: args.shift });
        }
    },
    validateShiftsForPreviousWeek: {
        type: GraphQLString,
        description: "Return a list of employees with schedules problems",
        args: {
            endDate: { type: GraphQLDate },
            entityId: { type: GraphQLInt },
            departmentId: { type: GraphQLInt }
        },
        resolve(root, args) {


            //Create a new date based on endDate  and substract 6 days
            var startDate = new Date(args.endDate)
            startDate.setDate(startDate.getDate() - 6);

            //Create new date range for current week
            var newStartDate = new Date(args.endDate);
            newStartDate.setDate(newStartDate.getDate() + 1);//Add one day
            var newEndDate = new Date(newStartDate)//Add six days
            newEndDate.setDate(newEndDate.getDate() + 6);//Add one day

            var currentDate = new Date(newStartDate), dateList = [];
            //Get every day between startDate and endDate to generate ShiftDetail records
            while (currentDate <= newEndDate) {
                dateList.push(new Date(currentDate))
                currentDate.setDate(currentDate.getDate() + 1)
            }

            //Get Shift belonging to Previous Week
            Db.models.ShiftDetail.findAll({
                where: {
                    [Op.and]: [
                        { startDate: { [Op.gte]: startDate } },
                        { startDate: { [Op.lte]: args.endDate } }
                    ]
                },
                include: [
                    {
                        model: Db.models.Shift,
                        where: {
                            departmentId: args.departmentId,
                            entityId: args.entityId,
                            isTemplate: false,
                            isActive: true
                        }
                    }
                ]
            }).then(shiftDetails => {
                shiftDetails.map(shiftDetail => {
                    var date = dateList.find(item => { return item.getDay() == shiftDetail.startDate.getDay() })
                    if (date) {
                        Db.models.ShiftDetail.findAll({
                            where: {
                                [Op.and]: [
                                    { startDate: date },
                                    {
                                        [Op.or]: [
                                            {
                                                startTime: { [Op.lte]: shiftDetail.startTime },
                                                endTime: { [Op.gte]: shiftDetail.startTime }
                                            },
                                            {
                                                startTime: { [Op.lte]: shiftDetail.endTime },
                                                endTime: { [Op.gte]: shiftDetail.endTime }
                                            }
                                        ]
                                    }
                                ]
                            },
                            include: {
                                model: Db.models.Shift,
                                where: {
                                    departmentId: args.departmentId,
                                    entityId: args.entityId,
                                    isTemplate: false,
                                    isActive: true
                                }
                            }
                        })
                            .then(newShiftDetails => {
                                newShiftDetails.map(newShiftDetail => {
                                    var _shiftDetail = newShiftDetail.dataValues
                                })
                            })
                    }
                })
            })


        }
    },
    ShiftBoard: {
        type: new GraphQLList(ShiftBoardType),
        description: 'List Shift records of board',
        args: {
            shift: { type: inputShiftQuery },
            shiftEntity: { type: inputShiftBoardCompany },
            workOrder: { type: inputQueryWorkOrder },
        },
        resolve(root, args) {
            return Db.models.Shift.findAll({
                where: args.shift,
                order: [[
                    Db.models.ShiftWorkOrder,
                    'WorkOrderId', 'DESC'
                ]],
                include: [{
                    model: Db.models.BusinessCompany,
                    as: 'ShiftEntity',
                    where: { ...GetShitEntityFilter(args.shiftEntity) },
                    required: true
                },
                {
                    model: Db.models.ShiftWorkOrder,
                    required: true,
                    include: [{
                        model: Db.models.WorkOrder,
                        as: 'WorkOrder',
                        where: {
                            ...GetWorkOrderFilter(args.workOrder)
                        },
                        required: true,
                        include: [{
                            model: Db.models.PositionRate
                        }]
                    }]
                }, {
                    model: Db.models.OpeningRecruiter,
                    include: [{
                        model: Db.models.Users
                    }]
                }]
            }).then(shifts => {
                var boardShifts = [];
                let counter = 0;
                let WOID = 0
                let data;
                let users = [];
                let companyCode = '';

                shifts.map(shift => {

                    if (args.shiftEntity)//Validate if exists shiftEntity parameter
                        if (args.shiftEntity.Code)//Validate if Code filter exists 
                            if (!Number.isInteger(parseInt(args.shiftEntity.Code)))
                                companyCode = args.shiftEntity.Code;

                    if (shift.dataValues.ShiftEntity.dataValues.Code.toUpperCase().includes(companyCode.toUpperCase()) || companyCode.toUpperCase() == '') {

                        if (WOID == shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId) {
                            counter++;
                        }
                        else {
                            counter = 1;
                        }
                        data = {
                            id: shift.dataValues.id,
                            title: shift.dataValues.title,
                            quantity: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.quantity,
                            workOrderId: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId,
                            CompanyName: shift.dataValues.ShiftEntity.dataValues.Name,
                            needExperience: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.needExperience,
                            needEnglish: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.needEnglish,
                            zipCode: shift.dataValues.ShiftEntity.dataValues.Zipcode,
                            Id_positionApplying: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.PositionRate.dataValues.Id_positionApplying,
                            positionName: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.PositionRate.dataValues.Position,
                            status: shift.dataValues.status,
                            isOpening: shift.dataValues.status == 2,
                            shift: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.shift,
                            endShift: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.endShift,
                            count: counter,
                            startDate: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.startDate,
                            endDate: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.endDate,
                            date: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.date,
                            comment: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.comment,
                            EspecialComment: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.EspecialComment,
                            dayWeek: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.dayWeek,
                            IdEntity: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.IdEntity,
                            contactId: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.contactId,
                            PositionRateId: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.PositionRateId,
                            OpeningRecruiter: shift.dataValues.OpeningRecruiters ? shift.dataValues.OpeningRecruiters : [],
                            departmentId: shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.departmentId
                        }

                        if (shift.dataValues.OpeningRecruiters) {
                            shift.dataValues.OpeningRecruiters.map(_or => {
                                users.push(_or.dataValues.User.dataValues);
                            })
                            data.Users = users;
                        } else
                            data.Users = [];

                        boardShifts.push(data);

                        users = [];

                        WOID = shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId;
                    }
                });


                return boardShifts;

            });
        }
    },
    shiftVsWorkedHours: {
        type: shiftVsWorkedHoursType,
        description: 'List of Shift vs Marked Hours',
        resolve(root, args) {
            return Db.models.Employees.findAll({
                include: [{
                    model: Db.models.ShiftDetailEmployees,
                    include: [{
                        model: Db.models.ShiftDetail,
                        required: true
                    }]
                }, {
                    model: Db.models.MarkedEmployees
                }]
            }).then(ret => {
                //momentDurationFormatSetup(moment);
                let totalSchedulesHours = 0;
                let totalWorkedHours = 0;

                let EmployeesHours = ret.map(Employee => {

                    let SchedulesHours = Employee.dataValues.ShiftDetailEmployees.reduce((acum, item) => {
                        return acum + moment(item.dataValues.ShiftDetail.dataValues.endTime, 'hh:mm').diff(moment(item.dataValues.ShiftDetail.dataValues.startTime, 'hh:mm'), 'hours');
                    }, 0);

                    // let WorkedHours = Employee.dataValues.MarkedEmployees.reduce((acum, item) => { 
                    //     return acum + 
                    // }, 0);

                    totalSchedulesHours += SchedulesHours;
                    totalWorkedHours += totalWorkedHours;

                    return {
                        id: Employee.dataValues.id,
                        name: Employee.dataValues.firstName + ' ' + Employee.dataValues.lastName,
                        schedulesHours: SchedulesHours,
                        workedHours: 0,
                        difference: SchedulesHours - 0
                    }
                });

                let EmployeesHoursTotal = {
                    schedulesHours: totalSchedulesHours,
                    workedHours: totalWorkedHours,
                    difference: totalSchedulesHours - totalWorkedHours,
                    detail: EmployeesHours
                };

                return EmployeesHoursTotal;
            });
        }
    }
};

export default ShiftQuery;
