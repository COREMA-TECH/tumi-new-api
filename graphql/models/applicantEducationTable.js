import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantEducations', {
			schoolType: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			educationName: {
				type: Sequelize.STRING(150),
				allowNull: false
			},
			educationAddress: {
				type: Sequelize.STRING(150),
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
			graduated: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			degree: {
				type: Sequelize.STRING(150),
				allowNull: false
			}
		});
	}
};
