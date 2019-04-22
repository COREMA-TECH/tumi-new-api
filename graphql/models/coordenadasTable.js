import Sequelize from 'sequelize';
export default {
    createModel(Conn) {
        return Conn.define('Coordenadas', {
            zipCode: {
                type: Sequelize.STRING,
                allowNull: false,
				primaryKey: true
            },
            Lat: {
                type: Sequelize.STRING,
                allowNull: true
            },
            Long: {
                type: Sequelize.STRING,
                allowNull: true
            },
        },
            {
                freezeTableName: true,
                timestamps: false,
                tableName: 'Coordenadas'
            });
    }
};
