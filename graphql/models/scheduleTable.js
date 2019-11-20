import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Schedule',
			{
				userId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				code: {
					type: Sequelize.STRING,
					allowNull: false
				},								
				isActive: {
					type: Sequelize.BOOLEAN,
					defaultValue: true
				}
			}
		);
	}
};