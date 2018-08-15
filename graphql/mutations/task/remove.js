const {
    GraphQLID,
    GraphQLNonNull
} = require('graphql');

//Require the task type
const taskType = require('./../../types/task');


//Require the task type
const TaskModel = require('./../../../models/task');

let removeTask = {
    type: taskType,
    args: {
        _id: {
            name: '_id',
            type: GraphQLNonNull(GraphQLID)
        }
    },
    async resolve(params) {
        const removedTask = await TaskModel.findByIdAndRemove(params._id);

        if (!removedTask) {
            throw new Error('Error removing task');
        }

        return removedTask;
    }
};

modules.exports = removeTask;
