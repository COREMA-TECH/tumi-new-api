import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'MarkedEmployees',
			{
				entityId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				typeMarkedId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				markedDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				markedTime: {
					type: Sequelize.STRING,
					allowNull: true
				},
				imageMarked: {
					type: Sequelize.STRING,
					allowNull: true
				},
				EmployeeId: {
					type: Sequelize.INTEGER,
				},
				ShiftId: {
					type: Sequelize.INTEGER,
				},
				flag: {
					type: Sequelize.BOOLEAN
				},
				notes: {
					type: Sequelize.STRING
				}
			}
		);
	}
};
