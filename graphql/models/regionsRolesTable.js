import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'RegionsRoles',
			{
                isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				}
			}
		);
	}
};