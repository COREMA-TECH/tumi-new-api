import Sequelize from 'sequelize';

export default {
	createModel(Conn) {
		return Conn.define(
			'EmployeeByHotels',
			{
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
