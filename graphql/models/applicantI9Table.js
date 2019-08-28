import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicantI9',
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
					type: Sequelize.INTEGER,
					allowNull: true
				},
				completed: {
					type: Sequelize.BOOLEAN,
					defaultValue: false
				},
				html: {
					type: Sequelize.TEXT('long')
				},				
				fieldsData: {
					type: Sequelize.STRING,
					allowNull: true
				}
			}
		);
	}
};
