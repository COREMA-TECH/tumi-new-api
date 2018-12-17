import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ShiftDetail',
			{
				startDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				endDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				startTime: {
					type: Sequelize.STRING,
					allowNull: true
				},
				endTime: {
					type: Sequelize.STRING,
					allowNull: true
				}
			}
		);
	}
};
