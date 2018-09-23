import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantLanguages', {
			idLanguage: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			writing: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			conversation: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
