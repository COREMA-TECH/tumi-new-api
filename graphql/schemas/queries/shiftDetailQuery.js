import { GraphQLList, GraphQLString, GraphQLInt, GraphQLBoolean, GraphQLInputObjectType } from 'graphql';
import { ShiftDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';

const Op = Sequelize.Op;

const inputShiftDetailQuery = new GraphQLInputObjectType({
    name: 'inputShiftDetailQuery',
    description: 'Inputs ShiftDetail query',
    fields: {
        id: { type: GraphQLInt },
        ShiftId: { type: GraphQLInt }
    }

});

const ShiftDetailQuery = {
    ShiftDetail: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            shiftDetail: { type: inputShiftDetailQuery },
            isTemplate: { type: GraphQLBoolean, defaultValue: false },
            isActive: { type: GraphQLBoolean, defaultValue: true }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({
                where: args.shiftDetail,
                include: [
                    {
                        model: Db.models.Shift,
                        where: { isTemplate: args.isTemplate, isActive: args.isActive }
                    }
                ]
            });
        }
    },
    ShiftDetailByMarked: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            startDate: { type: GraphQLDate }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({ where: args });
        }
    },
    ShiftDetailByDate: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            startDate: { type: GraphQLDate },
            endDate: { type: GraphQLDate },
            employeeId: { type: new GraphQLList(GraphQLInt) },
            startTime: { type: GraphQLString },
            endTime: { type: GraphQLString },
            shiftDetailId: { type: new GraphQLList(GraphQLInt) },
            daysWeek: { type: GraphQLString }
        },
        resolve(root, args) {

            //Create dates to be included in Query Where
            var datesList = [];
            var currentDate = new Date(args.startDate); //Variables used to save the current date inside the while
            //Replace daysWeek string with days numbers, starting Monday with 1 and finishing Sunday with 0
            var daysWeek = args.daysWeek.replace("MO", 1).replace("TU", 2).replace("WE", 3).replace("TH", 4).replace("FR", 5).replace("SA", 6).replace("SU", 0)
            //Get every day between startDate and endDate to generate ShiftDetail records
            while (currentDate <= args.endDate) {
                let newDate = new Date(currentDate)
                if (daysWeek.includes(newDate.getDay())) {
                    datesList.push(newDate);
                }
                currentDate.setDate(currentDate.getDate() + 1)
            }

            return Db.models.ShiftDetail.findAll({
                where: {
                    [Op.and]: [
                        {
                            startDate: {
                                [Op.in]: datesList
                            }

                        },
                        {
                            [Op.or]: [
                                {
                                    startTime: { [Op.lte]: args.startTime },
                                    endTime: { [Op.gte]: args.startTime }
                                },
                                {
                                    startTime: { [Op.lte]: args.endTime },
                                    endTime: { [Op.gte]: args.endTime }
                                }
                            ]
                        }, {
                            id: { [Op.notIn]: args.shiftDetailId }
                        }]

                },
                include: [
                    {
                        model: Db.models.ShiftDetailEmployees,
                        where: { EmployeeId: { [Op.in]: args.employeeId } }
                    }
                ]

            });
        }
    },
    shiftDetailByWeek: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift records for Specific Dates/Location/Position',
        args: {
            startDate: {
                type: GraphQLDate
            },
            endDate: {
                type: GraphQLDate
            },
            idPosition: {
                type: GraphQLInt
            },
            entityId: {
                type: GraphQLInt
            },
            isTemplate: { type: GraphQLBoolean, defaultValue: false }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({
                where: {
                    [Op.and]: [
                        { startDate: { [Op.gte]: args.startDate } },
                        { startDate: { [Op.lte]: args.endDate } }
                    ]
                },
                include: [
                    {
                        model: Db.models.Shift,
                        where: {
                            idPosition: args.idPosition,
                            entityId: args.entityId,
                            isTemplate: args.isTemplate
                        }
                    }
                ]
            });
        }
    }
};

export default ShiftDetailQuery;
