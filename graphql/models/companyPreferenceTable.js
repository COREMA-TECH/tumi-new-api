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
			},
			FiscalMonth1: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			FiscalMonth2: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			Timezone: {
				type: Sequelize.INTEGER,
				allowNull: true
			}
		});
	}
};
