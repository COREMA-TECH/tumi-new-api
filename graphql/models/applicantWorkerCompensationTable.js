import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantWorkerCompensation', {
			applicantAddress: {
				type: Sequelize.STRING(150),
				allowNull: true
			},
			applicantCity: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			applicantState: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			applicantZipCode: {
				type: Sequelize.STRING(20),
				allowNull: true
			},
			employerName: {
				type: Sequelize.STRING(150),
				allowNull: true
			},
			initialNotification: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			injuryNotification: {
				type: Sequelize.BOOLEAN,
				allowNull: true
			},
			injuryDate: {
				type: Sequelize.DATE,
				allowNull: true
			},
			signature: {
				type: Sequelize.TEXT('long'),
				allowNull: true
			},
			content: {
				type: Sequelize.TEXT('long'),
				allowNull: false
			},
			date: {
				type: Sequelize.DATE,
				allowNull: true
			},
			applicantName: {
				type: Sequelize.STRING(150),
				allowNull: true
			},
			completed: {
				type: Sequelize.BOOLEAN,
				defaultValue: false
			},
			pdfUrl: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});
	}
};
