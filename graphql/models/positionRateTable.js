import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'PositionRate',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
				Id_Contract: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Id_Entity: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Id_Department: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Id_positionApplying: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Position: {
					type: Sequelize.STRING(60),
					allowNull: false
				},
				Bill_Rate: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				Pay_Rate: {
					type: Sequelize.DOUBLE,
					allowNull: false
				},
				Shift: {
					type: Sequelize.STRING(1),
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
				},
				Id_positionApplying: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Comment: {
					type: Sequelize.STRING,
					allowNull: true
				},
				catalogItem_id:{
					type: Sequelize.INTEGER,
					allowNull: false
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'PositionRate'
			}
		);
	}
};
