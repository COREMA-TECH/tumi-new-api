import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('phaseworkOrder', {
            userId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            phaseworkOrderId: {
                type: Sequelize.INTEGER,
                allowNull: true
            }
        });
    }
};
