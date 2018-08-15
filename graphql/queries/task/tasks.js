const {
    GraphQLObjectType,
    GraphQLList
} = require('graphql');

//Require the task model
const TaskModel = require('../../../models/task');

//Require the GraphQL Type
const TaskType = require('../../types/task');

const TaskQuery = {
    name: 'Tasks',
    description: 'To get all the tasks',
    type: new GraphQLList(TaskType),
    args: {},
    resolve() {
        return TaskModel.find({}).exec();
    }
};

module.exports = TaskQuery;