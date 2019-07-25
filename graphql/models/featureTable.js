import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'Feature',
            {
                code: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                crud: {
                    type: Sequelize.STRING,
                    allowNull: false,
                    defaultValue: ''
                }
            }
        );
    }
};
