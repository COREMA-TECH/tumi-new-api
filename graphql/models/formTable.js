import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Forms',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Code: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Name: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Value: {
					type: Sequelize.STRING,
					allowNull: true
				},
				IsActive: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				User_Created: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				User_Updated: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Date_Created: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Date_Updated: {
					type: Sequelize.STRING,
					allowNull: true
				},
				sort: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
				},
				ParentId: {
					type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 0
				}				,
				show: {
					type: Sequelize.BOOLEAN	,
					allowNull: false,
					defaultValue: false
				},
				icon: {
					type: Sequelize.STRING,
					allowNull: true
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Forms'
			}
		);
	}
};
