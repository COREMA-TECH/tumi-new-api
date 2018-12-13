import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ShiftEmployees',
			{
				idWorkOrder: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				idPosition: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				idEntity: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				titleShift: {
					type: Sequelize.STRING,
					allowNull: true
				},
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
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: true
				}
			}
		);
	}
};
