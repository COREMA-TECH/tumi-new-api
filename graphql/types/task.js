const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLID
} = require('graphql');


const TaskType = new GraphQLObjectType({
    name: 'Task',
    description: 'This represent a task',
    fields: () => ({
    	_id: {
    		type: new GraphQLNonNull(GraphQLID)
    	},
        title: {
        	type: new GraphQLNonNull(GraphQLString)
        },
        description: {
        	type: GraphQLString
        }
    })
});


module.exports = TaskType;