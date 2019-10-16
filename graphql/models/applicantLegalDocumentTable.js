import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'ApplicantLegalDocument',
            {
                fieldsData: {
                    type: Sequelize.TEXT('long'),
                    allowNull: true
                },
                url: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                completed: {
                    type: Sequelize.BOOLEAN,
                    allowNull: false
                }
            }
        );
    }
};