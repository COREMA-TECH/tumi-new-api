import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantLanguages', {
			language: {
				type: Sequelize.STRING(50),
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
