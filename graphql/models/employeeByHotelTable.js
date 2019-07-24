import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'EmployeeByHotels',
			{
				creationDate: {
					type: Sequelize.DATE,
					allowNull: false
                },
                updateDate: {
					type: Sequelize.DATE,
					allowNull: false
                },
				isDefault: {
					type: Sequelize.BOOLEAN,
					allowNull: false
                },
                isActive: {
					type: Sequelize.BOOLEAN,
					allowNull: false
				}
			}
		);
	}
};
