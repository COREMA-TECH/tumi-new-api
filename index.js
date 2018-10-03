const express = require('express');
const GraphHTTP = require('express-graphql');
const Schema = require('./graphql/schemas/schemas').default;
const root = require('./Configuration/Roots.js');
const path = require('path');
import depthLimit from 'graphql-depth-limit';

var APP_PORT = 4000;
var cors = require('cors');
var app = express();
const SECRET = 'asda47#$*5444adtyydssdZad!#%**';

app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/graphql',
	GraphHTTP({
		schema: Schema,
		pretty: true,
		rootValue: root,
		graphiql: true,
		context: {
			SECRET
		},
		validationRules: [ depthLimit(10) ]
	})
);

app.listen(process.env.PORT || APP_PORT, function() {
	console.log(`Server is running.. on Port ${APP_PORT}`);
});
