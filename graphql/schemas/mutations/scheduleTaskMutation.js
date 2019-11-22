import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';
import Axios from 'axios';

import { inputScheduleType, inputScheduleLogType, inputScheduleNoteType, inputScheduleMeetingType } from '../types/operations/insertTypes';
import { ScheduleType, ScheduleLogType, ScheduleMeetingType, ScheduleNoteType } from '../types/operations/outputTypes';

const ScheduleTaskMutation = {
    addScheduleRecord: {
        type: GraphQLString,
        description: "createNewSchedule",
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            applicationId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            input: {
                type: inputScheduleType
            }
        },
        async resolve(root, args) {
            const { task_type, subject, description, due_date, email_reminder } = args.input;

            const configuration = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            const payload = { 
                taskType: task_type,
                dueDate: due_date,
                emailReminder: email_reminder,
                subject, description
            }

            const {data: {task}} = await Axios.post(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/tasks/create`, payload, configuration);

            //Insert in local DB
            await Db.models.Schedule.create({ userId: args.userId, code: task, isActive: true });
            return task;
        }
    },

    addScheduleNote: {
        type: GraphQLString,
        description: "create new schedule Note",
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            applicationId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            input: {
                type: inputScheduleNoteType
            }
        },
        async resolve(root, args) {
            const { description } = args.input;

            const configuration = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            const payload = { description };

            const {data: {note}} = await Axios.post(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/notes/create`, payload, configuration);

            //Insert in local DB
            await Db.models.Schedule.create({ userId: args.userId, code: note, isActive: true });
            return note;
        }
    },

    addScheduleLog: {
        type: GraphQLString,
        description: "create new schedule Log",
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            applicationId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            input: {
                type: inputScheduleLogType
            }
        },
        async resolve(root, args) {
            const { log_type, contacted, call_outcome, date, description } = args.input;

            const configuration = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            const payload = { logType: log_type, contacted, callOutcome: call_outcome, date, description };

            const {data: {log}} = await Axios.post(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/logs/create`, payload, configuration);

            //Insert in local DB
            await Db.models.Schedule.create({ userId: args.userId, code: log, isActive: true });
            return log;
        }
    },

    addScheduleMeeting: {
        type: GraphQLString,
        description: "create new schedule Note",
        args: {
            userId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            applicationId: {
                type: new GraphQLNonNull(GraphQLInt)
            },
            input: {
                type: inputScheduleMeetingType
            }
        },
        async resolve(root, args) {
            const { attendees, date, duration, description } = args.input;

            const configuration = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            const payload = { attendees, date, duration, description };

            const {data: {meeting}} = await Axios.post(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/meetings/create`, payload, configuration);

            //Insert in local DB
            await Db.models.Schedule.create({ userId: args.userId, code: meeting, isActive: true });
            return note;
        }
    },
}

export default ScheduleTaskMutation;