import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('PhaseWorkOrder', {
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
