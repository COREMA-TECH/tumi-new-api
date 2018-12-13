import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'employeesTable',
			{
				firstName: {
					type: Sequelize.STRING,
					allowNull: true
				},
				lastName: {
					type: Sequelize.STRING,
					allowNull: true
				},
				electronicAddress: {
					type: Sequelize.STRING,
					allowNull: true
				},
				mobileNumber: {
					type: Sequelize.STRING,
					allowNull: true
				},
				idRole: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				},
				userCreated: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				userUpdated: {
					type: Sequelize.INTEGER,
					allowNull: false
				}
			}
		);
	}
};
