import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('Applications', {
			idLanguage: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
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
				allowNull: true
			},
			streetAddress: {
				type: Sequelize.STRING(150),
				allowNull: true
			},
			emailAddress: {
				type: Sequelize.STRING(150),
				allowNull: true
			},
			aptNumber: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			city: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			state: {
				type: Sequelize.STRING(50),
				allowNull: true
			},
			zipCode: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			homePhone: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			cellPhone: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			socialSecurityNumber: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			positionApplyingFor: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			birthDay: {
				type: Sequelize.DATE,
				allowNull: true
			},
			car: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			typeOfId: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			expireDateId: {
				type: Sequelize.DATE,
				allowNull: true
			},
			dateAvailable: {
				type: Sequelize.DATE,
				allowNull: true
			},
			scheduleRestrictions: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			scheduleExplain: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			convicted: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			convictedExplain: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			comment: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: true
			}
		});
	}
};
