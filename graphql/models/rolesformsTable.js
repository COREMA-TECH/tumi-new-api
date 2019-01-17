import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'RolesForms',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				IdRoles: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				IdForms: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				IsActive: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				User_Created: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				User_Updated: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Date_Created: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Date_Updated: {
					type: Sequelize.STRING,
					allowNull: false
				}
			}
		);
	}
};
