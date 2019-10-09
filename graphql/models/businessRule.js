import Sequelize from 'sequelize';

export default {
    createModel(Conn){
        return Conn.define(
			'BusinessRule',
			{
				catalogItemId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				name: {
					type: Sequelize.STRING,
					allowNull: false
				},
				multiplier: {
					type: Sequelize.FLOAT,
					allowNull: true
				},
				baseIncrement: {
					type: Sequelize.FLOAT,
					allowNull: true
                },
                startAfterHours: {
					type: Sequelize.FLOAT,
					allowNull: true
				},
				days: {
					type: Sequelize.STRING,
					allowNull: true
                },
				startTime: {
					type: Sequelize.STRING,
					allowNull: true
                },
				endTime: {
					type: Sequelize.STRING,
					allowNull: true
				},                
				type: {
					type: Sequelize.STRING,
					allowNull: true
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: true
				}
			}
		);
    }
}