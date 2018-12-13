import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ShiftDetails',
			{
				startDate: {
					type: Sequelize.STRING,
					allowNull: true
				},
				endDate: {
					type: Sequelize.STRING,
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
