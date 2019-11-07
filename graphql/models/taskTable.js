import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Tasks',
			{
				email: {
					type: Sequelize.STRING,
					allowNull: true
                },
                phoneNumber: {
					type: Sequelize.STRING,
					allowNull: true
                },
                description: {
					type: Sequelize.STRING,
					allowNull: true
                },
                location: {
					type: Sequelize.STRING,
					allowNull: true
                },
                date: {
					type: Sequelize.STRING,
					allowNull: false
                },
                hour: {
					type: Sequelize.STRING,
					allowNull: false
                }
			}
		);
	}
};