import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ElectronicAddress',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Related_Table: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Id_Entity: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Electronic_Address_Type: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Electronic_Address: {
					type: Sequelize.STRING,
					allowNull: false
				},
				IsPrimary: {
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
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'ElectronicAddress'
			}
		);
	}
};
