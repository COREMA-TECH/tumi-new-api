import { inputInsertTask } from '../types/operations/insertTypes';
import { inputUpdateTask } from '../types/operations/updateTypes';
import { TaskType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';
import { sendSMSApi } from '../../../Utilities/SMSManagement';
import { sendEmailApi } from '../../../Utilities/EmailManagement';
import moment from 'moment-timezone';

import Db from '../../models/models';

const TaskMutation = {
    addTask: {
        type: TaskType,
        description: 'Add Task to database',
        args: {
            task: { type: inputInsertTask }
        },
        resolve(source, args) {
            return Db.models.Tasks.create(args.task, { returning: true });
        }
    },
    addSendtoInterviewTask: {
        type: TaskType,
        description: 'Add Task to database',
        args: {
            task: { type: inputInsertTask },
            applicationId: { type: GraphQLInt }
        },
        resolve(source, args) {

            return Db.models.Tasks.create(args.task, { returning: true }).then(task => {
                const {email, phoneNumber, location, date, hour, userId} = args.task;
                if(email || phoneNumber){
                    Db.models.Users.findOne({ where: { Id: userId} })
                    .then(user => {
                        const userName = user ? user.dataValues.Full_Name : '';
                        const messagetoSend = ` You have been schedule for an interview at ${location} \n on ${date} at ${hour},\n with ${userName}.\n Thank you, and hope to see you there. If you can’t make the interview please contact the us at INFO@TUMISTAFFING.COM or 210-853-2099`;
                        if(email){ // Send by email
                            sendEmailApi({
                                from: '', // TODO: (LF) Pendiente de agregar correo de origen
                                to: email,
                                subject: 'Interview notification',
                                message: messagetoSend
                            });
                        }
                        if(phoneNumber){ // Send by SMS
                            sendSMSApi({
                                msg: messagetoSend,
                                number: phoneNumber
                            });
                        }
                    })
                }
                if(args.applicationId){
                    Db.models.Applications
                    .update({ sendInterview: true },
                        {
                            where: {
                                id: args.applicationId
                            }
                        }
                    );
                }

                return task;
            });
        }
    },
    updateTask: {
        type: TaskType,
        description: 'Update Task Record',
        args: {
            task: { type: inputUpdateTask }
        },
        resolve(source, args) {
            return Db.models.Tasks
                .update(args.task,
                    {
                        where: {
                            id: args.task.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    },
    deleteTask: {
		type: GraphQLInt,
		description: 'Delete Task record from database',
		args: {
			id: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.Tasks.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default TaskMutation;
