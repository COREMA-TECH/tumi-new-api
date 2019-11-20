import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicationHiredStates',
			{
				origin: {
					type: Sequelize.STRING,
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
