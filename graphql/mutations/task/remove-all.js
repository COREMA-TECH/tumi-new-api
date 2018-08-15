const {
    GraphQLBoolean
} = require('graphql');
//Require the task type
const TaskModel = require('./../../../models/task');

let removeAllTasks = {
    type: GraphQLBoolean,
    async resolve(params) {
        return TaskModel.remove({});
    }
};

modules.exports = removeAllTasks;
