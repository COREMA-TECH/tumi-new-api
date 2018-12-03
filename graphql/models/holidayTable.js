import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define('Holiday', {
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            startDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            endDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            description: {
                type: Sequelize.STRING,
                allowNull: false
            },
            CompanyId: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
            anually: {
                type: Sequelize.BOOLEAN,
                allowNull: false
            },
            weekDays: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            weekNumbers: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            months: {
                type: Sequelize.STRING(500),
                allowNull: false
            },
            calendarDays: {
                type: Sequelize.STRING(500),
                allowNull: false
            }
        });
    }
};
