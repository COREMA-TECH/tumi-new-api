import { GraphQLInt, GraphQLList, GraphQLString, GraphQLNonNull } from 'graphql';
import { PositionRateType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';

const PositionRateQuery = {
    positions: {
        type: new GraphQLList(PositionRateType),
        description: 'List of Postions and Rates',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.PositionRate.findAll({ where: args });
        }
    },
    position: {
        type: PositionRateType,
        description: 'Get a specific record',
        args: {
            Id: { type: GraphQLInt },
            IsActive: { type: GraphQLInt },
            Position: { type: GraphQLString },
            Id_Entity: { type: GraphQLInt }
        },
        resolve(root, args) {
            let keys = Object.keys(args);
            if (keys.length > 0) {
                let filter = [];
                keys.map(key => {
                    if (key === "Position")
                        filter.push(
                            Sequelize.where(
                                Sequelize.fn('upper', Sequelize.col(key)), {
                                $eq: args[key].toUpperCase()
                            }
                            ),
                        )
                    else filter.push({ [key]: args[key] });
                })
                return Db.models.PositionRate.find({
                    where: {
                        $and: filter
                    }
                });
            }
            else return null;
        }
    },
    uniquePosition: {
        type: PositionRateType,
        description: 'Get a specific record',
        args: {
            Id: { type: GraphQLInt },
            Position: { type: GraphQLString },
            Id_Entity: { type: GraphQLInt }
        },
        resolve(root, args) {
            let keys = Object.keys(args);
            if (keys.length > 0) {
                let filter = [{ IsActive: 1 }];
                keys.map(key => {
                    if (key === "Position")
                        filter.push(
                            Sequelize.where(
                                Sequelize.fn('upper', Sequelize.col(key)), {
                                $eq: args[key].toUpperCase()
                            }
                            ),
                        )
                    else if (key === "Id")
                        filter.push({ Id: { $ne: args[key] } });
                    else filter.push({ [key]: args[key] });
                })
                return Db.models.PositionRate.find({
                    where: {
                        $and: filter
                    }
                });
            }
            else return null;
        }
    },
    positionsWithWorkOrders: {
        type: new GraphQLList(PositionRateType),
        description: 'List work order records',
        args: {
            IdEntity: { type: new GraphQLNonNull(GraphQLInt) },
            departmentId: { type: new GraphQLNonNull(GraphQLInt) },
            startDate: { type: new GraphQLNonNull(GraphQLDate) },
            endDate: { type: new GraphQLNonNull(GraphQLDate) }
        },
        resolve(root, args) {
            let { startDate, endDate, ...filter } = args;

            filter = {
                ...filter, groupKey: { $not: null },
                $and: [
                    { startDate: { $gte: new Date(startDate.setUTCHours(0, 0, 0)) } },
                    { startDate: { $lte: new Date(endDate.setUTCHours(23, 59, 59)) } }]
            };

            return Db.models.PositionRate.findAll({
                order: [
                    ['Position', 'ASC']
                ],
                include: [
                    {
                        model: Db.models.WorkOrder,
                        required: true,
                        where: filter

                    }
                ]
            })
        }
    }
};

export default PositionRateQuery;
