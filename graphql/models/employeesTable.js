import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Employees',
			{
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
				hireDate: {
					type: Sequelize.STRING,
					allowNull: true
				},
				startDate: {
					type: Sequelize.STRING,
					allowNull: true
				}
			}
		);
	}
};
