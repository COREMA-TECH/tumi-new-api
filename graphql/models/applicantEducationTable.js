import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantEducations', {
			schoolType: {
				type: Sequelize.STRING(100),
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
				allowNull: true
			},
			endDate: {
				type: Sequelize.DATE,
				allowNull: true
			},
			graduated: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			degree: {
				type: Sequelize.INTEGER,
				allowNull: true
			}
		});
	}
};
