import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantMilitaryServices', {
			branch: {
				type: Sequelize.STRING,
				allowNull: false
			},
			startDate: {
				type: Sequelize.DATE,
				allowNull: false
			},
			endDate: {
				type: Sequelize.DATE,
				allowNull: false
			},
			rankAtDischarge: {
				type: Sequelize.STRING,
				allowNull: false
			},
			typeOfDischarge: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			ApplicationId: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
