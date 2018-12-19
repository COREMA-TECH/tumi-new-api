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
				allowNull: true
			},
			PositionRateId: {
				type: Sequelize.INTEGER,
				allowNull: true
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
			endShift: {
				type: Sequelize.STRING(1),
				allowNull: true
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
