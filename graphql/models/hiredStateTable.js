import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'HiredStates',
			{
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				description: {
					type: Sequelize.STRING,
					allowNull: true
				},
				order: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				}
			}
		);
	}
};
