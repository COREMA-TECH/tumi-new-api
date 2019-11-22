import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList, GraphQLNonNull } from 'graphql';

import { ScheduleType, ScheduleLogType, ScheduleMeetingType, ScheduleNoteType, ScheduleItemCategory } from '../types/operations/outputTypes';
import Axios from 'axios';

const scheduleQuery = {
    taskTypes: {
        type: new GraphQLList(ScheduleItemCategory),
        async resolve(root, args) {
            const axiosConfig = { headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` } }

            const {data: {taskTypes}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/task-types`, axiosConfig);
            return taskTypes;            
        }
    },  
    
    logTypes: {
        type: new GraphQLList(ScheduleItemCategory),
        async resolve(root, args) {
            const axiosConfig = { headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` } }

            const {data: {logTypes}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/log-types`, axiosConfig);
            return logTypes;            
        }
    }, 

    scheduledTasks: {
        type: new GraphQLList(ScheduleType),
        args: {
            taskType: { type: GraphQLInt },
            userId: { type: GraphQLInt },
            applicationId: { type: GraphQLInt },
            isActive: { type: GraphQLBoolean },            
        },
        async resolve(root, args) {
            const axiosConfig = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            try {
                const url = args.taskType ? `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/tasks/type/${args.taskType}` : `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/tasks`;
                const {data: {tasks}} = await Axios.get(url, axiosConfig);

                if(args.userId){
                    const local = await Db.models.Schedule.findAll({
                        where: { userId: args.userId, isActive: args.isActive, applicationId: args.applicationId }
                    });

                    const codes = local.map(({dataValues: schedule}) => {
                        return schedule.code;
                    }).join();

                    return tasks.filter(task => {
                        return codes.includes(task.task_code);
                    });
                } else {
                    return tasks;
                }
                
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledLogs: {
        type: new GraphQLList(ScheduleLogType),
        args: {
            logType: { type: GraphQLInt },
            userId: { type: GraphQLInt },
            applicationId: { type: GraphQLInt },
            isActive: { type: GraphQLBoolean },            
        },
        async resolve(root, args) {
            const axiosConfig = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            try {
                const url = args.logType ? `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/logs/type/${args.logType}` : `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/logs`;
                const {data: {logs}} = await Axios.get(url, axiosConfig);

                if(args.userId){
                    const local = await Db.models.Schedule.findAll({
                        where: { userId: args.userId, isActive: args.isActive, applicationId: args.applicationId }
                    });

                    const codes = local.map(({dataValues: schedule}) => {
                        return schedule.code;
                    }).join();

                    return logs.filter(log => {
                        return codes.includes(log.log_code);
                    });
                } else {
                    return logs;
                }
                
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledNotes: {
        type: new GraphQLList(ScheduleNoteType),
        args: {
            userId: { type: GraphQLInt },
            applicationId: { type: GraphQLInt },
            isActive: { type: GraphQLBoolean },            
        },
        async resolve(root, args) {
            const axiosConfig = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            try {
                const url = `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/notes`;
                const {data: {notes}} = await Axios.get(url, axiosConfig);

                if(args.userId){
                    const local = await Db.models.Schedule.findAll({
                        where: { userId: args.userId, isActive: args.isActive, applicationId: args.applicationId }
                    });

                    const codes = local.map(({dataValues: schedule}) => {
                        return schedule.code;
                    }).join();

                    return notes.filter(note => {
                        return codes.includes(note.note_code);
                    });
                } else {
                    return notes;
                }
                
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledMeetings: {
        type: new GraphQLList(ScheduleMeetingType),
        args: {
            userId: { type: GraphQLInt },
            applicationId: { type: GraphQLInt },
            isActive: { type: GraphQLBoolean },            
        },
        async resolve(root, args) {
            const axiosConfig = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            try {
                const url = `${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/meetings`;
                const {data: {meetings}} = await Axios.get(url, axiosConfig);

                if(args.userId){
                    const local = await Db.models.Schedule.findAll({
                        where: { userId: args.userId, isActive: args.isActive, applicationId: args.applicationId }
                    });

                    const codes = local.map(({dataValues: schedule}) => {
                        return schedule.code;
                    }).join();

                    return meetings.filter(meeting => {
                        return codes.includes(meeting.meeting_code);
                    });
                } else {
                    return meetings;
                }
                
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledTask: {
        type: ScheduleType,        
        args: {
            code: { type: new GraphQLNonNull(GraphQLString) },
            isActive: { type: GraphQLBoolean }
        },
        async resolve(root, args) {
            const {dataValues: local} = await Db.models.Schedule.find({
                where: { code: args.code, isActive: args.isActive }
            });

            try {
                const axiosConfig = {
                    headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
                }

                const {data: {task}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/tasks/${local.code}`, axiosConfig);            
                return task;
            }
            
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledLog: {
        type: ScheduleLogType,        
        args: {
            code: { type: new GraphQLNonNull(GraphQLString) },
            isActive: { type: GraphQLBoolean }
        },
        async resolve(root, args) {
            const {dataValues: local} = await Db.models.Schedule.find({
                where: { code: args.code, isActive: args.isActive }
            });

            try {
                const axiosConfig = {
                    headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
                }

                const {data: {log}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/logs/${local.code}`, axiosConfig);            
                return log;
            }
            
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledNote: {
        type: ScheduleNoteType,        
        args: {
            code: { type: new GraphQLNonNull(GraphQLString) },
            isActive: { type: GraphQLBoolean }
        },
        async resolve(root, args) {
            const {dataValues: local} = await Db.models.Schedule.find({
                where: { code: args.code, isActive: args.isActive }
            });

            try {
                const axiosConfig = {
                    headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
                }

                const {data: {note}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/notes/${local.code}`, axiosConfig);            
                return note;
            }
            
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    },

    scheduledMeeting: {
        type: ScheduleMeetingType,        
        args: {
            code: { type: new GraphQLNonNull(GraphQLString) },
            isActive: { type: GraphQLBoolean }
        },
        async resolve(root, args) {
            const {dataValues: local} = await Db.models.Schedule.find({
                where: { code: args.code, isActive: args.isActive }
            });

            try {
                const axiosConfig = {
                    headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
                }

                const {data: {meeting}} = await Axios.get(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/meetings/${local.code}`, axiosConfig);            
                return meeting;
            }
            
            catch (error) {
                console.log(error);
                throw new Error(error);
            }
        }
    }
}

export default scheduleQuery;