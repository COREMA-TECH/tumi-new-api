import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import { ShiftType } from '../types/operations/outputTypes';
import { inputShiftQuery } from '../types/operations/insertTypes';

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

            console.log("dateList:::", dateList)
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
                                    console.log({
                                        id: _shiftDetail.id, startDate: _shiftDetail.startDate,
                                        endDate: _shiftDetail.endDate, startTime: _shiftDetail.startTime,
                                        endTime: _shiftDetail.endTime
                                    })
                                })
                            })
                    }
                })
            })


        }
    }
};

export default ShiftQuery;
