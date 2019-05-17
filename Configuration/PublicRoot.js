const pg = require('pg');
import { ConfigPg } from './Configuration';
import jwt from 'jsonwebtoken';

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

	try {
		Strquery =
			'select "Id","Password","Code_User","Full_Name" ,"Id_Roles" ,"Electronic_Address"  ,"Phone_Number"  ,"Id_Language"  ,"IsAdmin"  ,"AllowEdit"  ,"AllowDelete"  ,"AllowInsert","AllowExport" ,"IsActive","IdSchedulesEmployees","IdSchedulesManager","isEmployee","manageApp","Id_Entity","CompanyName" from public.vwValid_User Where  "Code_User" = ' +
			args.Code_User +
			' and "Password" = ' +
			args.Password;

		//console.log(Strquery);

		const { rows } = await query(Strquery);

		if (rows.length <= 0) return null;
		else {
			const user = rows[0];
			const token = jwt.sign(
				{
					user: { Id: user.Id, Code_User: user.Code_User }
				},
				SECRET,
				{
					expiresIn: '1y'
				}
			);

			return { Token: token, ...user };
		}
	} catch (err) {
		//console.log('Database ' + err);
		return err;
	}
}

const root = {
	getvalid_users: getValid_Users
};

module.exports = root;
