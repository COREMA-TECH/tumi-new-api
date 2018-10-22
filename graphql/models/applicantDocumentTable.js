import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantDocument', {
			url: {
				type: Sequelize.STRING(500),
				allowNull: false
			},
			fileName: {
				type: Sequelize.STRING(50),
				allowNull: false
			},
			fileExtension: {
				type: Sequelize.STRING(50),
				allowNull: false
			}
		});
	}
};
