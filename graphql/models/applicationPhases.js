import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('ApplicationPhases', {
            UserId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            ReasonId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            StageId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            ApplicationId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            WorkOrderId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            ShiftId: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            Comment: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });
    }
};
