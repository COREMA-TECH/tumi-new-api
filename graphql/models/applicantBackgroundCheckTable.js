import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantBackgroundChecks', {
			vehicleReportRequired: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			driverLicenseNumber: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			commercialDriverLicense: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			licenseState: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			licenseExpiration: {
				type: Sequelize.DATE,
				allowNull: true
			},
			signature: {
				type: Sequelize.TEXT('long'),
				allowNull: true
			},
			content: {
				type: Sequelize.STRING,
				allowNull: false
			},
			date: {
				type: Sequelize.DATE,
				allowNull: true
			},
			applicantName: {
				type: Sequelize.STRING(150),
				allowNull: true
			}
		});
	}
};
