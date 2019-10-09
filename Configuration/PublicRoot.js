const pg = require('pg');
import { ConfigPg } from './Configuration';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import Db from '../graphql/models/models';

var Strquery, Strfilename;

//Conection to BD
const pool = new pg.Pool(ConfigPg);
async function query(q) {
	const client = await pool.connect();
	let res;
	try {
		await client.query('BEGIN');
		try {
			res = await client.query(q);
			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		}
	} finally {
		client.release();
	}
	return res;
}

async function getValid_Users(args, { SECRET }) {

	const {Code_User, Password} = args;            
	const data = await Db.models.Users.findOne({
		where: { Code_User },
		returning: true
	});

	if(!data || !data.dataValues){
		throw new Error("Access Denied");
	}

	const {dataValues: user} = data;
	const match = await bcrypt.compare(Password, user.Password);

	if(!match){
		throw new Error("Access Denied");
	}

	const Token = await jwt.sign({ user: { Id: user.Id, Code_User: user.Code_User }}, process.env.SECRET, { expiresIn: '1y' });
	return {...user, Token};
}

const root = {
	getvalid_users: getValid_Users
};

module.exports = root;
