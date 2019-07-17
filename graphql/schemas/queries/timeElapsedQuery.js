import { GraphQLInt, GraphQLList } from 'graphql';
import { ApplicationPhaseType, TimeElapsedType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import moment from 'moment';

const timeElapsedQuery = {
    timeElapsed: {
        type: new GraphQLList(TimeElapsedType),
        description: 'List of Phases',
        args: {
            ShiftId: {
                type: GraphQLInt
            },
            UserId: {
                type: GraphQLInt
            },
            StageId: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            },
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({
                where: args,
                include: [
                    {
                        model: Db.models.Shift,
                        as: 'Shift',
                        required: true
                    },
                    {
                        model: Db.models.Applications,
                        required: true
                    }
                ],
                limit: 5,
                order: [['createdAt', 'DESC']]
            }).then(function (users) {
                let Elapsed = [];
                let getTimes = [];

                users.map((user) => {
                    var duration = moment.utc(moment(user.createdAt, "DD/MM/YYYY HH:mm:ss").diff(moment(user.Shift.createdAt, "DD/MM/YYYY HH:mm:ss"))).format("DD") + ' days, '
                    var hour = moment.utc(moment(user.createdAt, "DD/MM/YYYY HH:mm:ss").diff(moment(user.Shift.createdAt, "DD/MM/YYYY HH:mm:ss"))).format("HH") + 'hrs, '
                    var minute = moment.utc(moment(user.createdAt, "DD/MM/YYYY HH:mm:ss").diff(moment(user.Shift.createdAt, "DD/MM/YYYY HH:mm:ss"))).format("mm") + 'min'

                    Elapsed = {
                        Full_Name: user.Application.firstName + ' ' + user.Application.lastName,
                        TimeElapsed: duration + '' + hour + '' + minute,
                        RecruiterId: user.UserId,
                        WorkOrderId: user.WorkOrderId,
                        ShiftId: user.ShiftId,
                    }

                    getTimes.push(Elapsed)

                })

                return getTimes
            });
        }
    }
};

export default timeElapsedQuery;
