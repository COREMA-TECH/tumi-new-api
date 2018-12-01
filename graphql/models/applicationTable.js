import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('Applications', {
			idLanguage: {
				type: Sequelize.STRING(3),
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
			lastName2: {
				type: Sequelize.STRING(50),
				allowNull: true
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
			generalComment: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			idealJob: {
				type: Sequelize.STRING(255),
				allowNull: true
			},
			signature: {
				type: Sequelize.TEXT,
				allowNull: true
			},
			isLead: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: true
			},
			idRecruiter: {
				type: Sequelize.INTEGER,
				allowNull: true

			},
			idWorkOrder: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			idStages: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			isActive: {
				type: Sequelize.BOOLEAN,
				allowNull: true,
				defaultValue: true
			},
			Urlphoto: {
				type: Sequelize.STRING(500),
				allowNull: true
			}
		});
	}
};
