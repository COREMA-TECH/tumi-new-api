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
				},
				startDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				endDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				dayWeek: {
					type: Sequelize.STRING,
					allowNull: true
				},
				comment: {
					type: Sequelize.STRING,
					allowNull: true
				},
				isTemplate: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					defaultValue: true
				}
			}
		);
	}
};
