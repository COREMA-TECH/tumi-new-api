const {
    GraphQLObjectType,
    GraphQLSchema
} = require('graphql');

//Require GraphQL queries
const queries = require('./queries');
const mutations = require('./mutations');

//Create the GraphQL Schema
const TaskQuery = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: queries
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        fields: mutations
    })
});

module.exports = TaskQuery;
