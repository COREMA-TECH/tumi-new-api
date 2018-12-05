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
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            weekNumbers: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            months: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            },
            calendarDays: {
                type: Sequelize.TEXT('long'),
                allowNull: false
            }
        });
    }
};
