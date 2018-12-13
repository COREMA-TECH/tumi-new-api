import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Shift',
			{
				entityId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				title: {
					type: Sequelize.STRING,
					allowNull: true
				},
				color: {
					type: Sequelize.STRING,
					allowNull: true
				},
				status: {
					type: Sequelize.INTEGER,
					allowNull: true
				}
			}
		);
	}
};
