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
				allowNull: true
			},
			startDate: {
				type: Sequelize.DATE,
				allowNull: true
			},
			endDate: {
				type: Sequelize.DATE,
				allowNull: true
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
