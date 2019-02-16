import { inputInsertUser } from '../types/operations/insertTypes';
import { UsersType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';
import Sequelize from 'sequelize';

const UserMutation = {
    addUser: {
        type: UsersType,
        description: 'Add user to database',
        args: {
            user: { type: inputInsertUser },
            idEmployee: { type: GraphQLInt }
        },
        resolve(source, args) {
            var user = {
                ...args.user,
                Password: Sequelize.fn('PGP_SYM_ENCRYPT', 'TEMP', 'AES_KEY')
            }
            //Begin transaction
            return Db.transaction((t) => {
                //Create User
                return Db.models.Users.create(user, { transaction: t })
                    .then(_user => {

                        return Db.models.Employees.findOne({ where: { id: args.idEmployee } })
                            .then(employee => {
                                var _foundEmployee = employee.dataValues;

                                //Crate Application
                                var application = {
                                    firstName: _foundEmployee.firstName,
                                    middleName: '',
                                    lastName: _foundEmployee.lastName,
                                    date: new Date().toISOString(),
                                    emailAddress: _foundEmployee.electronicAddress,
                                    cellPhone: _foundEmployee.mobileNumber,
                                    car: false,
                                    scheduleRestriction: false,
                                    scheduleExplain: '',
                                    convicted: false,
                                    convictedExplain: '',
                                    comment: '',
                                    isActive: true,
                                    idLanguage: 'es',
                                    isLead: false,
                                    lastName2: '',
                                }
                                return Db.models.Applications.create(application, { transaction: t })
                                    .then(_application => {
                                        //Associate User to Employee
                                        return Db.models.Employees.update(
                                            { idUsers: _user.dataValues.Id },
                                            { where: { id: args.idEmployee }, transaction: t }
                                        ).then(_employee => {
                                            return Db.models.ApplicationEmployees.create({
                                                ApplicationId: _application.dataValues.id,
                                                EmployeeId: args.idEmployee
                                            }, { transaction: t })
                                                .then(_applicationEmployee => {


                                                    //Insert to ApplicationIdealJobs
                                                    return Db.models.PositionRate.findOne({ where: { Id: _foundEmployee.Contact_Title } })
                                                        .then(Positions => {
                                                            var idealjobs = {
                                                                ApplicationId: _application.dataValues.id,
                                                                description: Positions.dataValues.Position,
                                                                idPosition: _foundEmployee.Contact_Title
                                                            }

                                                            return Db.models.ApplicantIdealJobs.create(idealjobs, { transaction: t })
                                                                .then(_applicantidealjobs => {
                                                                    return _user.dataValues;
                                                                });

                                                        })

                                                    //Return user just created 
                                                    // return _user.dataValues;
                                                })
                                        })
                                    })
                            })

                    })
            })

        }
    }
}
export default UserMutation;