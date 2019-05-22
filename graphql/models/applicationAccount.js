import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicationAccount',
			{
                applicationId: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                firstName: {
                    type: Sequelize.STRING,
                    allowNull: false                  
                },
                lastName: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                city: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                state: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                zipcode: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                bankNumber: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                routingNumber: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                accountNumber: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },
                accountType: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                amount: {
                    type: Sequelize.FLOAT,
                    allowNull: false
                },
                amountType: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
			}
		);
	}
};
