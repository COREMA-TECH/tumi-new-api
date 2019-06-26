import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantMilitaryServices', {
			branch: {
				type: Sequelize.STRING,
				allowNull: true
			},
			startDate: {
				type: Sequelize.DATE,
				allowNull: true
			},
			endDate: {
				type: Sequelize.DATE,
				allowNull: true
			},
			rankAtDischarge: {
				type: Sequelize.STRING,
				allowNull: true
			},
			typeOfDischarge: {
				type: Sequelize.INTEGER,
				allowNull: true
			},
			ApplicationId: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
