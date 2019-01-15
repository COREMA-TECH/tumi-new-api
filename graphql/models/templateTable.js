import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'Template',
            {
                title: {
                    type: Sequelize.STRING,
                    allowNull: true
                }
            }
        );
    }
};
