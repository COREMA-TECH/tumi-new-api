import Sequelize from 'sequelize';
export default {
	createModel(Conn) {
		return Conn.define('WorkOrder', {
			IdEntity: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			userId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			contactId: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			status: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			quantity: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			shift: {
				type: Sequelize.STRING(1),
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
			needExperience: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			needEnglish: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			comment: {
				type: Sequelize.STRING,
				allowNull: false
			},
			EspecialComment: {
				type: Sequelize.STRING,
				allowNull: true
			}
		});
	}
};
