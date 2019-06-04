import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'ApplicationAccountDocument',
			{
                applicationAccountId: {
                    type: Sequelize.INTEGER,
                    allowNull: false
                },               
                path: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                extension: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
			}
		);
	}
};
