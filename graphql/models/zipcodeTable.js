import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('Zipcode', {
            Zipcode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            Lat: {
                type: Sequelize.STRING,
                allowNull: true
            },
            Long: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            City: {
                type: Sequelize.STRING
            }
        },
            {
                freezeTableName: true,
                timestamps: false,
                // define the table's name
                tableName: 'Zipcode'
            });
    }
};
