const {
    GraphQLBoolean,
    GraphQLNonNull
} = require('graphql');

//Require the task type
const taskType = require('./../../types/task');


//Require the task type
const TaskModel = require('./../../../models/task');

let addTask = {
    type: GraphQLBoolean,
    args: {
        data: {
            name: 'data',
            type: GraphQLNonNull(taskType)
        }
    },
    async resolve(params){
        //Create the object model with data
        const task = new TaskModel(params.data);

        //Save the object in the database
        const newTask = await task.save();

        if (!newTask){
            throw new Error('Error adding new task');
        }

        return true;
    }
};


modules.exports = addTask;
