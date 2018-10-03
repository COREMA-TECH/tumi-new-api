import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('CompanyPreferences', {
			charge: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			PeriodId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			amount: {
				type: Sequelize.FLOAT,
				allowNull: true
			},
			EntityId: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
