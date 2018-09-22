import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('Applications', {
			firstName: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			middleName: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			streetAddress: {
				type: Sequelize.STRING(150),
				allowNull: false
			},
			aptNumber: {
				type: Sequelize.STRING(20),
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
			zipCode: {
				type: Sequelize.STRING(10),
				allowNull: false
			},
			homePhone: {
				type: Sequelize.STRING(20),
				allowNull: false
			},
			cellPhone: {
				type: Sequelize.STRING(20),
				allowNull: false
			},
			socialSecurityNumber: {
				type: Sequelize.STRING(20),
				allowNull: false
			},
			positionApplyingFor: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			dateAvailable: {
				type: Sequelize.DATE,
				allowNull: false
			},
			scheduleRestrictions: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			scheduleExplain: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			convicted: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			convictedExplain: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			comment: {
				type: Sequelize.STRING(255),
				allowNull: false
			}
		});
	}
};
