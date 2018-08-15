const express = require('express');
const graphQLExpress = require('express-graphql');
const mongoose = require('mongoose');

//Require the GraphQL Schema
const schema = require('./graphql');

let app = express();
const Config = require('../Configuration/Configuration.js');

app.use('/graphql', graphQLExpress({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen((process.env.PORT || 4000), function () {
    console.log('Server is running.. on Port 4000');	
});
