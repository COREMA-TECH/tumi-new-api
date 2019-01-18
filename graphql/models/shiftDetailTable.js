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
				},
				color: {
					type: Sequelize.STRING,
					allowNull: false,
					defaultValue: "#96989A"
				},
				status: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
				}
			}
		);
	}
};
