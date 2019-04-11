import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Contacts',
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
				First_Name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Middle_Name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Last_Name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Electronic_Address: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Phone_Number: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Contact_Type: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				Id_Supervisor: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Id_Deparment: {
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
					allowNull: false
				},
				Contact_Title: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				ApplicationId: {
					type: Sequelize.INTEGER,
					allowNull: true
				}

			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Contacts'
			}
		);
	}
};
