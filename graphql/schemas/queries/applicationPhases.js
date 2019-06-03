import { GraphQLList, GraphQLString, GraphQLInt, GraphQLNonNull } from 'graphql';
import { ApplicationPhaseType, ApplicationPhaseResumeType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';
import GraphQLDate from 'graphql-date';

const Op = Sequelize.Op;

const ApplicationPhaseQuery = {
    application_phase: {
        type: new GraphQLList(ApplicationPhaseType),
        description: 'List Application by Phases records',
        args: {
            id: {
                type: GraphQLList(GraphQLInt)
            },
            UserId: {
                type: GraphQLInt
            },
            ReasonId: {
                type: GraphQLInt
            },
            ApplicationId: {
                type: GraphQLInt
            },
            StageId: {
                type: GraphQLInt
            },
            WorkOrderId: {
                type: GraphQLInt
            },
            Comment: {
                type: GraphQLString
            },
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({
                where: args,
                order: [['createdAt', 'DESC']]
            });
        }
    },
    applicationPhaseByDate: {
        type: new GraphQLList(ApplicationPhaseType),
        description: 'List Application by Phases records by a date range',
        args: {
            startDate: {
                type: (GraphQLDate)
            },
            endDate: {
                type: (GraphQLDate)
            },
            idRecruiter: {
                type: (GraphQLInt)
            }
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({
                where: {
                    ReasonId: 30458,
                    UserId: args.idRecruiter,
                    [Op.and]: [
                        { createdAt: { [Op.gte]: new Date(args.startDate.setUTCHours(0, 0, 0)) } },
                        { createdAt: { [Op.lte]: new Date(args.endDate.setUTCHours(23, 59, 59)) } }
                    ]
                },
                order: [['createdAt', 'DESC']]
            });
        }
    },
    applicationPhaseByDate_Resume: {
        type: ApplicationPhaseResumeType,
        description: 'List Application by Phases records by a date range',
        args: {
            startDate: {
                type: (GraphQLDate)
            },
            endDate: {
                type: (GraphQLDate)
            },
            idRecruiter: {
                type: (GraphQLInt)
            }
        },
        resolve(root, args) {
            return Db.models.ApplicationPhases.findAll({
                where: {
                    ReasonId: 30458,
                    UserId: args.idRecruiter,
                    [Op.and]: [
                        { createdAt: { [Op.gte]: new Date(args.startDate.setUTCHours(0, 0, 0)) } },
                        { createdAt: { [Op.lte]: new Date(args.endDate.setUTCHours(23, 59, 59)) } }
                    ],
                    [Op.or]: [
                        { ReasonId: 30458 },
                        { StageId: { $in: [30460, 30461] } }
                    ]
                },
                order: [['createdAt', 'DESC']]
            }).then(_phases => {
                let leadEntered = 0, sentToInterview = 0, showed = 0, noShow = 0, hired = 0, applications = [], data = [];
                _phases.map(_ => {
                    //Crate applications id list
                    if (!applications.find(i => i == _.ApplicationId))
                        applications.push(_.ApplicationId);

                    //Count status of application based on application phase or reason
                    if (_.StageId == 30460)
                        leadEntered++;
                    else if (_.StageId == 30461)
                        sentToInterview++;
                    if (_.ReasonId == 30458 && _.StageId == 30460)
                        noShow++;
                })
                return Db.models.Applications.findAll(
                    {
                        where: { id: { $in: applications } },
                        include: [{
                            model: Db.models.ApplicationEmployees,
                            include: [{
                                model: Db.models.Employees,
                                as: "Employees",
                                where: { hireDate: { $ne: null } }
                            }]
                        }]
                    }
                ).then(_ => {
                    return { leadEntered, sentToInterview, noShow, showed: sentToInterview - noShow, hired: _.length };
                })

            })
        }
    }
};

export default ApplicationPhaseQuery;