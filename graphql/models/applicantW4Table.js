import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicantW4',
			{
				url: {
					type: Sequelize.STRING,
					allowNull: true
				},
				fileName: {
					type: Sequelize.STRING,
					allowNull: true
				},
				fileExtension: {
					type: Sequelize.STRING,
					allowNull: true
				},
				completed: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				}
			}
		);
	}
};
