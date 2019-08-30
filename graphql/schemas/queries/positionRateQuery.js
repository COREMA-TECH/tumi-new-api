import { GraphQLInt, GraphQLList, GraphQLString } from 'graphql';
import { PositionRateType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';

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
    }
};

export default PositionRateQuery;
