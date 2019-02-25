const express = require('express');
const GraphHTTP = require('express-graphql');
const Schema = require('./graphql/schemas/schemas').default;
const root = require('./Configuration/Roots.js');
const PublicRoot = require('./Configuration/PublicRoot');
import { MY_PORT } from './Configuration/Configuration';

const path = require('path');
import depthLimit from 'graphql-depth-limit';
import jwt from 'jsonwebtoken';
import { PublicSchema } from './Configuration/PublicSchema';


var cors = require('cors');
var app = express();
const SECRET = 'asda47#$*5444adtyydssdZad!#%**';

const addUser = async (req, res) => {
	const token = req.headers.authentication;

	try {
		const { user } = await jwt.verify(token, SECRET);
		req.user = user;
	} catch (err) {
		res.status(401).send('Sorry, you are not allowed here!');
	}
	req.next();
};

//app.use(addUser);
app.use(cors());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/graphql',
	addUser,
	GraphHTTP((req) => {
		return {
			schema: Schema,
			pretty: true,
			rootValue: root,
			graphiql: true,
			context: {
				user: req.user,
				SECRET
			},
			validationRules: [depthLimit(10)]
		};
	})
);

app.use(
	'/login',
	GraphHTTP((req) => {
		return {
			schema: PublicSchema,
			pretty: true,
			rootValue: PublicRoot,
			graphiql: true,
			context: {
				SECRET
			},
			validationRules: [depthLimit(10)]
		};
	})
);

app.listen(process.env.PORT || MY_PORT, function () {
	console.log(`Server is running.. on Port ${MY_PORT}`);
});
