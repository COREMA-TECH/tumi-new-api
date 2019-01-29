import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Users',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Id_Entity: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Id_Contact: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Id_Roles: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Code_User: {
					type: Sequelize.STRING(15),
					allowNull: false
				},
				Full_Name: {
					type: Sequelize.STRING(120),
					allowNull: false
				},
				Electronic_Address: {
					type: Sequelize.STRING(60),
					allowNull: false
				},
				Phone_Number: {
					type: Sequelize.STRING(30),
					allowNull: true
				},
				Password: {
					type: Sequelize.STRING(4000),
					allowNull: false
				},
				Id_Language: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				IsAdmin: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				AllowDelete: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				AllowInsert: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				AllowEdit: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				AllowExport: {
					type: Sequelize.INTEGER,
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
					allowNull: true
				},
				IsRecruiter: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				IdRegion: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				isEmployee: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Users'
			}
		);
	}
};
