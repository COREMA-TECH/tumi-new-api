import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'TypeTasks',
			{
				name: {
					type: Sequelize.STRING,
					allowNull: false
                },
                description: {
					type: Sequelize.STRING,
					allowNull: true
                }
			}
		);
	}
};