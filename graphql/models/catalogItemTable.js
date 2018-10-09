import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'CatalogItem',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Id_Catalog: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Id_Parent: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Name: {
					type: Sequelize.STRING(150),
					allowNull: true
				},
				DisplayLabel: {
					type: Sequelize.STRING(150),
					allowNull: false
				},
				Description: {
					type: Sequelize.STRING(4000),
					allowNull: false
				},
				Value: {
					type: Sequelize.STRING(10),
					allowNull: false
				},
				Value01: {
					type: Sequelize.STRING(10),
					allowNull: false
				},

				Value02: {
					type: Sequelize.STRING(10),
					allowNull: false
				},
				Value03: {
					type: Sequelize.STRING(10),
					allowNull: false
				},
				Value04: {
					type: Sequelize.STRING(10),
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
				tableName: 'CatalogItem'
			}
		);
	}
};
