import { inputInsertTypeTask } from '../types/operations/insertTypes';
import { inputUpdateTypeTask } from '../types/operations/updateTypes';
import { TypeTaskType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const TypeTaskMutation = {
    addTypeTask: {
        type: TypeTaskType,
        description: 'Add Type Task to database',
        args: {
            typeTask: { type: inputInsertTypeTask }
        },
        resolve(source, args) {
            return Db.models.TypeTasks.create(args.typeTask, { returning: true });
        }
    },
    updateTypeTask: {
        type: TypeTaskType,
        description: 'Update Type Task Record',
        args: {
            typeTask: { type: inputUpdateTypeTask }
        },
        resolve(source, args) {
            return Db.models.TypeTasks
                .update(args.typeTask,
                    {
                        where: {
                            id: args.typeTask.id
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
    deleteTypeTask: {
		type: GraphQLInt,
		description: 'Delete Type Task record from database',
		args: {
			id: { type: new GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			return Db.models.TypeTasks.destroy({ where: { id: args.id } }).then((deleted) => {
				return deleted;
			});
		}
	}
};

export default TypeTaskMutation;
