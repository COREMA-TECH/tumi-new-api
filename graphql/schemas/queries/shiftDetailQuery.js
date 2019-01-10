import { GraphQLList, GraphQLString, GraphQLInt } from 'graphql';
import { ShiftDetailType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';

const Op = Sequelize.Op;

const ShiftDetailQuery = {
    ShiftDetail: {
        type: new GraphQLList(ShiftDetailType),
        description: 'List Shift Details  records',
        args: {
            id: { type: GraphQLInt },
            ShiftId: { type: GraphQLInt }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({ where: args });
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
            shiftDetailId: { type: GraphQLInt }
        },
        resolve(root, args) {
            return Db.models.ShiftDetail.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                {
                                    startDate: {
                                        [Op.lte]: args.endDate,
                                        [Op.gte]: args.startDate
                                    }
                                },
                                {
                                    endDate: {
                                        [Op.lte]: args.endDate,
                                        [Op.gte]: args.startDate
                                    }
                                },
                            ]
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
                            id: { [Op.ne]: args.shiftDetailId }
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
    }

};

export default ShiftDetailQuery;
