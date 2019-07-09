import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Visits',
			{
				startTime: {
					type: Sequelize.STRING,
					allowNull: false
                },
                endTime: {
					type: Sequelize.STRING,
					allowNull: false
                },
                url: {
					type: Sequelize.STRING,
					allowNull: true
                },
                comment: {
					type: Sequelize.STRING,
					allowNull: true
                },
                startLatitude: {
					type: Sequelize.STRING,
					allowNull: true
                },
                startLongitude: {
					type: Sequelize.STRING,
					allowNull: true
                },
                endLatitude: {
					type: Sequelize.STRING,
					allowNull: true
                },
                endLongitude: {
					type: Sequelize.STRING,
					allowNull: true
				},
				isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: true
				}
			}
		);
	}
};
