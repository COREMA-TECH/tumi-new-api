import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'Token',
			{
				Id: {
					type: Sequelize.INTEGER,
					allowNull: false,
					primaryKey: true,
					autoIncrement: true
				},
                Token: {
					type: Sequelize.STRING(120),
					allowNull: false
                },
                IsActive: {
					type: Sequelize.INTEGER,
					allowNull: false
                },
                Id_Contract: {
					type: Sequelize.INTEGER,
					allowNull: true
                },
                Signatory: {
					type: Sequelize.STRING(2),
					allowNull: true
                }
			},
			{
				freezeTableName: true,
				timestamps: false,
				// define the table's name
				tableName: 'Token'
			}
		);
	}
};
