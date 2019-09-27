import Sequelize from 'sequelize';
import moment from 'moment';

const getHour = (mark) => {
	let hours = mark.markedTime.split(' ');
	let _hour = hours[0];
	if (hours[1] == 'PM' && parseInt(hours[0]) != 12)
		_hour = moment(_hour, "hh:mm").add(12, 'hours').format("HH:mm");
	if (_hour.length == 4) _hour = `0${_hour}`;
	return _hour;
}

export default {
	createModel(Conn) {
		return Conn.define(
			'MarkedEmployees',
			{
				entityId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				markedDate: {
					type: Sequelize.DATE,
					allowNull: true
				},
				inboundMarkTypeId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				inboundMarkTime: {
					type: Sequelize.STRING,
					allowNull: true
				},
				inboundMarkImage: {
					type: Sequelize.TEXT('long'),
					allowNull: true
				},
				outboundMarkTypeId: {
					type: Sequelize.INTEGER,
					allowNull: true
				},
				outboundMarkTime: {
					type: Sequelize.STRING,
					allowNull: true
				},
				outboundMarkImage: {
					type: Sequelize.TEXT('long'),
					allowNull: true
				},
				EmployeeId: {
					type: Sequelize.INTEGER,
				},
				ShiftId: {
					type: Sequelize.INTEGER,
				},
				flag: {
					type: Sequelize.BOOLEAN
				},
				notes: {
					type: Sequelize.STRING
				},
				key: {
					type: Sequelize.STRING
				},
				approvedDate: {
					type: Sequelize.DATEONLY
				}
			}, {
				hooks: {
					beforeCreate: function (_, options) {
						_.markedTime = getHour(_);
					},
					beforeBulkCreate: function (_, options) {
						_.map(_ => {
							let mark = _.dataValues;
							mark.markedTime = getHour(mark);
						})
					}
				}
			}

		);
	},

};
