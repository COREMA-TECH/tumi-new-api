import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'BreakRuleDetail',
			{
				breakRuleId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
                shiftReached: {
					type: Sequelize.FLOAT,
					allowNull: false
				},				
                isRepeating: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				},
				days: {
					type: Sequelize.STRING,
					allowNull: false
				},
				breakStartTime: {
					type: Sequelize.STRING,
					allowNull: true
				},
				breakPlacement : {
					type: Sequelize.STRING,
					allowNull: false
				},
			}
		);
	}
};