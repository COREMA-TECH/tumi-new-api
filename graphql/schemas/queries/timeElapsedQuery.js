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
                order: [['createdAt', 'DESC']]
            }).then(function (users) {
                let Elapsed = [];
                let getTimes = [];

                users.map((user) => {
                    // console.log("(user.createdAt ", user.createdAt)
                    // console.log("user.Shift.createdAt ", user.Shift.createdAt)

                    var duration = moment.duration(moment.utc(moment(user.createdAt, "HH:mm:ss").diff(moment(user.Shift.createdAt, "HH:mm:ss"))).format("HH:mm")).asHours();
                    duration = parseFloat(duration).toFixed(2);

                    //var duration = moment.duration(moment.utc(moment(user.createdAt, "DD/MM/YYYY").diff(moment(user.Shift.createdAt, "DD/MM/YYYY"))).format("DD/MM/YYYY")).asDays();
                    //duration = parseFloat(duration).toFixed(2);


                    Elapsed = {
                        Full_Name: user.Application.firstName + ' ' + user.Application.lastName,
                        TimeElapsed: duration,
                        RecruiterId: user.UserId,
                        WorkOrderId: user.WorkOrderId,
                        ShiftId: user.ShiftId,
                    }

                    console.log(Elapsed)

                    getTimes.push(Elapsed)

                })

                return getTimes
            });
        }
    }
};

export default timeElapsedQuery;
