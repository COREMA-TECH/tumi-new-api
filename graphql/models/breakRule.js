import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'BreakRule',
			{
				businessCompanyId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				code: {
					type: Sequelize.STRING,
					allowNull: false
				},
				isPaid: {
					type: Sequelize.BOOLEAN,
					allowNull: false
                },
                isAutomatic: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				},
				lenght: {
					type: Sequelize.FLOAT,
					allowNull: false
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: true
				}
			}
		);
	}
};