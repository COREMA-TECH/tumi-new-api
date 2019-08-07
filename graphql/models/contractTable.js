import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Contracts',
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
				Contract_Name: {
					type: Sequelize.STRING,
					allowNull: false
                },
                Contrat_Owner: {
					type: Sequelize.STRING,
					allowNull: false
                },
                User_Signed_Title: {
					type: Sequelize.STRING,
					allowNull: false
                },
                Signed_Date: {
					type: Sequelize.DATE,
					allowNull: true
                },
                Contract_Status: {
					type: Sequelize.STRING(1),
					allowNull: false
                },
                Contract_Start_Date: {
					type: Sequelize.DATE,
					allowNull: false
                },
                Contract_Term: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Owner_Expiration_Notification: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Company_Signed: {
					type: Sequelize.STRING,
					allowNull: false
                },
                Company_Signed_Date: {
					type: Sequelize.DATE,
					allowNull: true
                },
				Billing_Street: {
					type: Sequelize.STRING,
					allowNull: false
                },
                Billing_City: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Billing_State: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Billing_Zip_Code: {
					type: Sequelize.STRING,
					allowNull: false
                },
                Billing_Country: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Exhibit_B: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Exhibit_C: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Exhibit_D: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Exhibit_E: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Exhibit_F: {
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
					type: Sequelize.DATE,
					allowNull: false
                },
                Date_Updated: {
					type: Sequelize.DATE,
					allowNull: false
                },
                Client_Signature: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Company_Signature: {
					type: Sequelize.STRING,
					allowNull: true
                },
                Contract_Expiration_Date: {
					type: Sequelize.DATE,
					allowNull: true
                },
                Contract_Terms: {
					type: Sequelize.STRING,
					allowNull: true
                },
                legalName: {
					type: Sequelize.STRING,
					allowNull: true
                }
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Contracts'
			}
		);
	}
};
