'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payroll = sequelize.define('Payroll', {
    weekStart: DataTypes.INTEGER,
    payPeriod: DataTypes.INTEGER,
    lastPayPeriod: DataTypes.DATE
  }, {});
  Payroll.associate = function(models) {
    // associations can be defined here
  };
  return Payroll;
};