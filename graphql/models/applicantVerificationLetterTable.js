import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define('ApplicantVerificationLetter', {
            html: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            fileName: {
                type: Sequelize.STRING,
                allowNull: false
            }
        });
    }
};