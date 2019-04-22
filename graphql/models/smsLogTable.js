import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'SMSLog',
            {
                number: {
                    type: Sequelize.STRING(25)
                },
                request: {
                    type: Sequelize.STRING
                },
                response: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                ShiftId: {
					type: Sequelize.INTEGER
				}
            }
        )
    }
}