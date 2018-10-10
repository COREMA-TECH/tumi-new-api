import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantDisclosures', {
			signature: {
				type: Sequelize.STRING,
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
