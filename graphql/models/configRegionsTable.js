import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ConfigRegions',
			{
				regionId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				regionalManagerId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				regionalDirectorId: {
					type: Sequelize.INTEGER,
					allowNull: false
				},
				regionalRecruiterId: {
					type: Sequelize.INTEGER,
					allowNull: false
				}
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'ConfigRegions'
			}
		);
	}
};
