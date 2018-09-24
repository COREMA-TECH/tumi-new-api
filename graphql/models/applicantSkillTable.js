import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantSkills', {
			description: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			level: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
