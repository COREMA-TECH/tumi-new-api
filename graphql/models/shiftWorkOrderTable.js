import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ShiftWorkOrder',
			{

			}
		);
	}
};
