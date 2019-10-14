import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'ApplicationDocumentType',
            {
                name: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                description: {
                    type: Sequelize.STRING,
                    allowNull: false
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: false
                }
            }
        );
    }
};
