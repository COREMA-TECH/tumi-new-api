const express = require('express');
const bodyParser = require('body-parser');
const GraphHTTP = require('express-graphql');
const Schema = require('./graphql/schemas/schemas').default;
const root = require('./Configuration/Roots.js');
const dotenv = require('dotenv');

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { MY_PORT } from './Configuration/Configuration';
import depthLimit from 'graphql-depth-limit';
import Db from './graphql/models/models';
import sequelize from 'sequelize';

const path = require('path');
const SECRET = 'asda47#$*5444adtyydssdZad!#%**';

const cors = require('cors');
const app = express();

dotenv.config({ path: './config.env' });

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

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

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

const processLogin = async (req, res) => {
	const {Code_User, Password} = req.body;            
	const data = await Db.models.Users.findOne({
		where: sequelize.where(
			sequelize.fn('lower', sequelize.col('Code_User')), 
			sequelize.fn('lower', Code_User)
		),
		returning: true
	});

	if(!data){
		return res.status(500).send({error: "User not found"});
	}

	const {dataValues: user} = data;
	const match = await bcrypt.compare(Password, user.Password);

	if(!match){
		return res.status(500).send({error: "Access Denied"});
	}

	const Token = await jwt.sign({ user: { Id: user.Id, Code_User: user.Code_User }}, process.env.SECRET, { expiresIn: '1y' });
	return res.status(200).send({...user, Token});
}

app.post('/login', async (req, res) => {
	return await processLogin(req, res);
});

app.listen(process.env.PORT || MY_PORT, function () {
	console.log(`Server is running.. on Port ${MY_PORT}`);
});
