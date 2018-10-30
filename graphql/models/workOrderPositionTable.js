import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('WorkOrderPosition', {
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
