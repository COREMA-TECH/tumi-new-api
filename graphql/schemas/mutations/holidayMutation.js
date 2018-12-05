import { inputInsertHoliday } from '../types/operations/insertTypes';
import { inputUpdateHoliday } from '../types/operations/updateTypes';
import { HolidayType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const HolidayMutation = {
    addHoliday: {
        type: new GraphQLList(HolidayType),
        description: 'Add holiday to database',
        args: {
            holidays: { type: new GraphQLList(inputInsertHoliday) }
        },
        resolve(source, args) {
            return Db.models.Holiday.bulkCreate(args.holidays, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateHoliday: {
        type: HolidayType,
        description: 'Update Holiday Record',
        args: {
            holiday: { type: inputUpdateHoliday }
        },
        resolve(source, args) {
            return Db.models.Holiday
                .update(
                    {
                        title: args.holiday.title,
                        startDate: args.holiday.startDate,
                        endDate: args.holiday.endDate,
                        description: args.holiday.description,
                        CompanyId: args.holiday.CompanyId,
                        anually: args.holiday.anually,
                        weekDays: args.holiday.weekDays,
                        weekNumber: args.holiday.weekNumber,
                        months: args.holiday.months,
                        calendarDays: args.holiday.calendarDays
                    },
                    {
                        where: {
                            id: args.document.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    },
    deleteHoliday: {
        type: GraphQLInt,
        description: 'Delete holiday record from database',
        args: {
            id: { type: GraphQLList(GraphQLInt) }
        },
        resolve(source, args) {
            return Db.models.Holiday.destroy({ where: { id: args.id } }).then((deleted) => {
                return deleted;
            });
        }
    }
};

export default HolidayMutation;
