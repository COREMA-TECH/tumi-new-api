import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantHarassmentPolicy', {
			companyPhoneNumber: {
				type: Sequelize.STRING(20),
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
			}
		});
	}
};
