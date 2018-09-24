import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define('ApplicantPreviousEmployments', {
			companyName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false
			},
			address: {
				type: Sequelize.STRING,
				allowNull: false
			},
			supervisor: {
				type: Sequelize.STRING,
				allowNull: false
			},
			jobTitle: {
				type: Sequelize.STRING,
				allowNull: false
			},
			payRate: {
				type: Sequelize.FLOAT,
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
			reasonForLeaving: {
				type: Sequelize.STRING,
				allowNull: false
			},
			ApplicationId: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		});
	}
};
