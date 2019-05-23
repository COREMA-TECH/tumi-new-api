import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Roles',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Id_Company: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Description: {
					type: Sequelize.STRING,
					allowNull: true
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
				},
				default_form_id: {
					type: Sequelize.INTEGER,
					allowNull: true
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Roles'
			}
		);
	}
};
