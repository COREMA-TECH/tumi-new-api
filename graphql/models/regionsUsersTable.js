import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'RegionsUsers',
			{
                isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				}
			}
		);
	}
};