import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicationHiredStates',
			{
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				}
			}
		);
	}
};
