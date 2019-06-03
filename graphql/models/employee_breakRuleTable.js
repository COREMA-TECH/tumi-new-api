import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Employee_BreakRule',
			{
				employeeId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				breakRuleId: {
					type: Sequelize.INTEGER,
					allowNull: false
				}
			}
		);
	}
};