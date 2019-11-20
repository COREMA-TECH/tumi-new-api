import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';
import Axios from 'axios';

import { inputScheduleType, inputScheduleLogType, inputScheduleNoteType, inputScheduleMeetingType } from '../types/operations/insertTypes';

const ScheduleRecordMutation = {
    addScheduleRecord: {
        type: { GraphQLString },
        description: "createNewSchedule",
        args: {
            input: {
                type: inputScheduleType
            }
        },
        async resolve(root, args) {
            const { task_type, subject, description, due_date, email_reminder } = args;

            const configuration = {
                headers: { "Authorization": `Bearer ${process.env.SCHEDULE_MS_TOKEN}` }
            }

            const payload = { 
                taskType: task_type,
                dueDate: due_date,
                emailReminder: email_reminder,
                subject, description
            }

            try {
                const {data: {task}} = await Axios.post(`${process.env.SCHEDULE_MS_URL}/${process.env.COMPANY_CODE}/tasks/create`, payload, configuration);
                console.log(task);
                return task;                
            } catch (error) {
                console.log(error);
                return "error";
            }            
        }
    }
}

export default ScheduleRecordMutation;