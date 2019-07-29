import { inputInsertEmployeeByHotel } from '../types/operations/insertTypes';
import { inputUpdateEmployeeByHotel } from '../types/operations/updateTypes';
import { EmployeeByHotelType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const EmployeeByHotelMutation = {
    addEmployeeByHotel: {
        type: new GraphQLList(EmployeeByHotelType),
        description: 'Add employee by hotel relation to database',
        args: {
            employeeByHotels: { type: new GraphQLList(inputInsertEmployeeByHotel) }
        },
        resolve(source, args) {
            return Db.models.EmployeeByHotels.bulkCreate(args.employeeByHotels, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateEmployeeByHotel: {
        type: EmployeeByHotelType,
        description: 'Update employee by hotel relation Record',
        args: {
            employeeByHotel: { type: inputUpdateEmployeeByHotel }
        },
        resolve(source, args) {

            return Db.models.EmployeeByHotels
                .update(
                        args.employeeByHotel
                    ,
                    {
                        where: {
                            id: args.employeeByHotel.id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    }
};

export default EmployeeByHotelMutation;