'use strict';
import Sequelize from 'sequelize';

export default {
    createModel(Conn) {
        return Conn.define(
            'OpeningRecruiter',
            {
                recruiterId: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
                openingId: {
                    type: Sequelize.INTEGER,
                    allowNull: true
                },
            }
        );
    }
};

// TODO: create assosiations
// OpeningRecruiter.hasMany(UsersTable, {foreignKey: 'recruiterId'});
// OpeningRecruiter.hasMany(OpeningTable, {foreignKey: 'openingId'});