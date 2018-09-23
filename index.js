const express = require('express');
const GraphHTTP = require('express-graphql');
const Schema = require('./graphql/schemas/schemas').default;

var APP_PORT = 4000;
var cors = require('cors');
var app = express();

app.use(cors());

app.use(
	'/graphql',
	GraphHTTP({
		schema: Schema,
		pretty: true,
		graphiql: true
	})
);

app.listen(process.env.PORT || APP_PORT, function() {
	console.log(`Server is running.. on Port ${APP_PORT}`);
});
