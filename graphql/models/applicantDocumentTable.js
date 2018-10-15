import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantDocument', {
			url: {
				type: Sequelize.STRING(500),
				allowNull: false
			}
		});
	}
};
