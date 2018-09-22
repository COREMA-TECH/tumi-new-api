const express = require('express');
const app = express();
var cors = require('cors');
const express_graphql = require('express-graphql');
const schema = require('./Configuration/Schemas.js');
const root = require('./Configuration/Roots.js');

app.use(cors());

app.use(
	'/graphql',
	express_graphql({
		schema: schema,
		rootValue: root,
		graphiql: true,
		pretty: true
	})
);

app.listen(process.env.PORT || 4000, function() {
	console.log('Server is running.. on Port 4000');
});
