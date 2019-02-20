import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('Zipcode', {
            Zipcode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            State: {
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
            },
            countryId :{
                type: Sequelize.INTEGER,
            },
            stateId :{
                type: Sequelize.INTEGER,
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
