import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString ,GraphQLInputObjectType} from 'graphql';
import { ShiftType,WorkOrderType } from '../types/operations/outputTypes';
import { ShiftBoardType } from '../types/operations/outputTypes';
import { inputShiftQuery, inputShiftBoardCompany,inputQueryWorkOrder } from '../types/operations/insertTypes';


import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';
import Db from '../../models/models';

const Op = Sequelize.Op;



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
                    //Find dates by week day
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

            console.log("ShiftBoard ", args )
            return Db.models.Shift.findAll({
                where: args.shift,
                order: [[
                    Db.models.ShiftWorkOrder,
                    'WorkOrderId','DESC'
                ]],
                include: [{
                    model: Db.models.BusinessCompany,
                    as: 'ShiftEntity',
                    where: args.shiftEntity,
                    required: true
                }, 
                {
                    model: Db.models.ShiftWorkOrder,
                    required: true,
                    include: [{
                        model: Db.models.WorkOrder,
                        as: 'WorkOrder',
                        where: args.workOrder,
                        required: true,
                        include: [{
                            model: Db.models.PositionRate
                        }]
                    }]
                }]
            }).then(shifts => {
                var boardShifts = [];
                let counter = 0;
                let WOID = 0

                //console.log("then(shifts => { ",shifts.shift)
                //let _id = shift.dataValues.length === 0 ? 0 :shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId;
               
                shifts.map(shift => {
                    if (WOID == shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId ){ 
                        counter++;
                   }
                else {
                    counter = 1;
                }


                    boardShifts.push({
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
                        startDate:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.startDate,
                        endDate:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.endDate,
                        date:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.date,
                        comment:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.comment,
                        EspecialComment:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.EspecialComment,
                        dayWeek:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.dayWeek,
                        IdEntity:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.IdEntity,
                        contactId:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.contactId,
                        PositionRateId:shift.dataValues.ShiftWorkOrder.dataValues.WorkOrder.dataValues.PositionRateId,
                    });
               
                    WOID = shift.dataValues.ShiftWorkOrder.dataValues.WorkOrderId;
                });
                return boardShifts;
             
            });
        }
    },
};

export default ShiftQuery;
