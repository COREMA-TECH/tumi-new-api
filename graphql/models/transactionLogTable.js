import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('TransactionLogs', {
			codeUser: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			nameUser: {
				type: Sequelize.STRING(100),
				allowNull: true
			},
			actionDate: {
				type: Sequelize.STRING,
				allowNull: false
			},
			action: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			affectedObject: {
				type: Sequelize.STRING(120),
				allowNull: true
			}
		});
	}
};
