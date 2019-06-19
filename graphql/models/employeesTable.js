import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Employees',
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
				},
				Id_Deparment: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Contact_Title: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				idUsers: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				idEntity: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				hireDate: {
					type: Sequelize.STRING,
					allowNull: true
				}
			}
		);
	}
};
