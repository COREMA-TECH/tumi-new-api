'use strict';
import UsersTable from '../graphql/models/UsersTable';
import OpeningTable from '../graphql/models/shiftDetailTable';

module.exports = (sequelize, DataTypes) => {
    const OpeningRecruiter = sequelize.define('OpeningRecruiter', {
        recruiterId: DataTypes.INTEGER,
        openingId: DataTypes.INTEGER
    }, {});
    OpeningRecruiter.associate = function (models) {
        // associations can be defined here
        OpeningRecruiter.hasMany(UsersTable, {foreignKey: 'recruiterId'});
        OpeningRecruiter.hasMany(OpeningTable, {foreignKey: 'openingId'});
    };
    return OpeningRecruiter;
};