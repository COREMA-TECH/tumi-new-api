import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'BusinessCompany',
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
				Id_Company: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Code: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Code01: {
					type: Sequelize.STRING,
					allowNull: true
				},
				BusinessType: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Name: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Description: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Start_Week: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				End_Week: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Legal_Name: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Country: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				State: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				City: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Id_Parent: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				ImageURL: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Start_Date: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Location: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Location01: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Rate: {
					type: Sequelize.DOUBLE,
					allowNull: true
				},
				Zipcode: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				Fax: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Phone_Prefix: {
					type: Sequelize.STRING,
					allowNull: true
				},
				Phone_Number: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Primary_Email: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Contract_URL: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Insurance_URL: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other_URL: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other_Name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other01_URL: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other01_Name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Suite: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Rooms: {
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
				},
				Contract_Status: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Contract_File: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Insurance_File: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other_File: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Other01_File: {
					type: Sequelize.STRING,
					allowNull: false
				},
				Region: {
					type: Sequelize.INTEGER,
					allowNull: false
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'BusinessCompany'
			}
		);
	}
};
