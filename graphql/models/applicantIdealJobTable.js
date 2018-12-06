import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantIdealJobs', {
			description: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			idPosition: {
				type: Sequelize.INTEGER,
				allowNull: true
			}
		});
	}
};
