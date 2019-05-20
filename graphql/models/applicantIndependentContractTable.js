import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'ApplicantIndependentContract',
            {
                url: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                fileName: {
                    type: Sequelize.STRING,
                    allowNull: true
                },
                fileExtension: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                html: {
                    type: Sequelize.TEXT('long')
                }
            }
        );
    }
};
