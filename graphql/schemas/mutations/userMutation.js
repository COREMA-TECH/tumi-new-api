import { inputInsertUser } from '../types/operations/insertTypes';
import { inputUpdateUser } from '../types/operations/updateTypes';
import { UsersType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, responsePathAsArray } from 'graphql';

import Db from '../../models/models';
import Sequelize from 'sequelize';
import { sendEmailResetPassword } from '../../../Configuration/Roots';

const bcrypt = require('bcrypt');

const addOrActiveRegionsUsers = async (userId, listRegionsId, transaction) => {
    let regionsUsersFound = await Db.models.RegionsUsers.findAll({ where: { UserId: userId } });

    let inactiveRegionsUsers = regionsUsersFound.filter(ru => !listRegionsId.includes(ru.RegionId)).map(ru => {
        return Db.models.RegionsUsers.update({ isActive: false }, { where: { id: ru.id }, returning: true, transaction });
    });

    let updateRegionsUsers = listRegionsId.map(async regionId => {
        const regionUser = await regionsUsersFound.find(ru => ru.RegionId === regionId);
        if (regionUser)
            return Db.models.RegionsUsers.update({ isActive: true }, { where: { id: regionUser.id }, returning: true, transaction });
        else
            return Db.models.RegionsUsers.create({
                UserId: userId,
                RegionId: regionId,
                isActive: true
            }, { returning: true, transaction });
    });

    return Promise.all([...inactiveRegionsUsers, ...updateRegionsUsers]);
}

const UserMutation = {
    createUser: {
        type: UsersType,
        description: 'Insert user to database',
        args: { user: { type: inputInsertUser } },
        resolve(source, args) {
            let user = {
                ...args.user,
                Password: Sequelize.fn('PGP_SYM_ENCRYPT', 'TEMP', 'AES_KEY'),
            }
            //Begin transaction
            return Db.models.Users.create(user);
        }
    },
    udpdateUser: {
        type: UsersType,
        description: 'Update user to database',
        args: {
            user: { type: inputUpdateUser },
            regionsId: { type: new GraphQLList(GraphQLInt) }
        },
        async resolve(source, args) {
            let { Password, Id, ...rest } = args.user;

            if (Password)
                rest = { ...rest, Password: Sequelize.fn('PGP_SYM_ENCRYPT', Password, 'AES_KEY') }

            return Db.transaction(t => {
                return Db.models.Users.update(rest, { where: { Id }, returning: true, transaction: t })
                    .then(async function ([rowsUpdate, [record]]) {
                        if (record) {
                            if (args.regionsId && args.regionsId.length > 0) {
                                return await addOrActiveRegionsUsers(Id, args.regionsId, t).then(_ => {
                                    return record.dataValues;
                                });
                            }
                            else return record.dataValues
                        }
                        else return null;
                    });
            });

        },
    },
    insertUser: {
        type: UsersType,
        description: 'Insert user to database',
        args: {
            user: { type: inputInsertUser },
            regionsId: { type: new GraphQLList(GraphQLInt) }
        },
        resolve(source, args) {
            var user = {
                ...args.user,
                Password: Sequelize.fn('PGP_SYM_ENCRYPT', 'TEMP', 'AES_KEY'),
                isEmployee: args.user.Id_Roles == 9
            }
            //Begin transaction
            return Db.transaction(t => {
                return Db.models.Users.create(user, { transaction: t })
                    .then(_user => {
                        // Insert Regions
                        if (args.regionsId && args.regionsId.length > 0) {
                            const regions = args.regionsId.map(r => {
                                return { UserId: _user.dataValues.Id, RegionId: r, isActive: true }
                            });
                            Db.models.RegionsUsers.bulkCreate(regions, { transaction: t });
                        }

                        if (args.user.Id_Roles != 5 && args.user.Id_Roles != 10) {
                            var employee = {
                                idRole: _user.Id_Roles,
                                isActive: true,
                                userCreated: _user.User_Created,
                                userUpdated: _user.User_Updated,
                                idUsers: _user.dataValues.Id
                            }
                            return Db.models.Employees.create(employee, { transaction: t })
                                .then(_employee => {
                                    var _foundEmployee = _employee.dataValues;
                                    let _newUser = _user.dataValues;

                                    //Crate Application
                                    var application = {
                                        firstName: _newUser.firstName,
                                        middleName: '',
                                        lastName: _newUser.lastName,
                                        date: new Date().toISOString(),
                                        emailAddress: _newUser.Electronic_Address,
                                        cellPhone: _newUser.Phone_Number,
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
                                            return Db.models.ApplicationEmployees.create({
                                                ApplicationId: _application.dataValues.id,
                                                EmployeeId: _foundEmployee.id
                                            }, { transaction: t })
                                                .then(_applicationEmployee => {
                                                    return _user.dataValues;
                                                })
                                        })
                                })
                        }
                        return _user.dataValues;
                    })
            })
        }
    },
    updatePassword: {
        type: UsersType,
        description: 'Reset password based on Username',
        args: {
            Code_User: { type: GraphQLString }
        },
        resolve(source, args) {
            let password = 'TEMP';
            return Db.models.Users.update({ Password: Sequelize.fn('PGP_SYM_ENCRYPT', password, 'AES_KEY') }, { where: { Code_User: args.Code_User }, returning: true })
                .then(([rowsUpdated, [Users]]) => {
                    if (Users) {
                        let { Electronic_Address, Code_User } = Users.dataValues;
                        sendEmailResetPassword({
                            email: Electronic_Address.trim(),
                            password: password,
                            username: Code_User
                        })
                        return Users;
                    }
                })
        }
    },
    addUserForApplication: {
        type: UsersType,
        description: 'Add user for application into database',
        args: {
            user: { type: inputInsertUser },
            applicationId: { type: GraphQLInt }
        },
        resolve(source, args) {
            var user = {
                ...args.user,
                Password: Sequelize.fn('PGP_SYM_ENCRYPT', 'TEMP', 'AES_KEY')
            }
            //Begin transaction
            return Db.transaction((t) => {
                return Db.models.Users.create(user, { transaction: t })
                    .then(_user => {
                        return Db.models.ApplicationEmployees.findOne({ where: { ApplicationId: args.applicationId } })
                            .then(_appEmp => {
                                //If employee record exists then update user id 
                                if (_appEmp) {
                                    return Db.models.Employees.update({ idUsers: _user.dataValues.Id }, { where: { id: _appEmp.EmployeeId }, transaction: t })
                                        .then(_updEmp => {
                                            return _user;
                                        })
                                } else {
                                    let employee = {
                                        idRole: 13,
                                        isActive: 1,
                                        userCreated: _user.dataValues.User_Created,
                                        userUpdated: _user.dataValues.User_Updated,
                                        idUsers: _user.dataValues.Id
                                    }
                                    return Db.models.Employees.create(employee, { transaction: t })
                                        .then(_newEmp => {
                                            let empHotel = {
                                                isDefault: true,
                                                isActive: true,
                                                BusinessCompanyId: args.user.Id_Entity == 0 ? null : args.user.Id_Entity,
                                                EmployeeId: _newEmp.id
                                            }
                                            Db.models.EmployeeByHotels.create(empHotel, { transaction: t })

                                            return Db.models.ApplicationEmployees.create({
                                                ApplicationId: args.applicationId,
                                                EmployeeId: _newEmp.id
                                            }, { transaction: t })
                                                .then(_newRelation => {
                                                    return _user
                                                })
                                        })
                                }
                            })
                    })
            })
        }
    },
    addUser: {
        type: UsersType,
        description: 'Add user to database',
        args: {
            user: { type: inputInsertUser },
            idEmployee: { type: GraphQLInt },
            pin: { type: GraphQLString }
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
                                if (employee) {
                                    var _foundEmployee = employee.dataValues;
                                    let _newUser = _user.dataValues;
                                    //Crate Application
                                    var application = {
                                        firstName: _newUser.firstName,
                                        middleName: '',
                                        lastName: _newUser.lastName,
                                        date: new Date().toISOString(),
                                        emailAddress: _newUser.Electronic_Address,
                                        cellPhone: _newUser.Phone_Number,
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
                                        pin: user.Code_User.substr(-4)
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
                                                            .then(_position => {
                                                                if (_position == null)
                                                                    return _user.dataValues;

                                                                var idealjobs = {
                                                                    ApplicationId: _application.dataValues.id,
                                                                    description: _position.dataValues.Position,
                                                                    idPosition: _foundEmployee.Contact_Title
                                                                }

                                                                return Db.models.ApplicantIdealJobs.create(idealjobs, { transaction: t })
                                                                    .then(_applicantidealjobs => {
                                                                        return _user.dataValues;
                                                                    });

                                                            })
                                                    })
                                            })
                                        })
                                }
                                else {
                                    return _user.dataValues
                                }
                            })

                    })
            })

        }
    },
    updatePasswordWithNewMethod: {
        type: new GraphQLList(UsersType),
        description: 'this method will be used to update old method encrypt/bd with new method bcrypt',
        resolve(source, args) {
            return Db.models.Users.findAll({
                attributes: [
                    "Id",
                    [Sequelize.fn('PGP_SYM_DECRYPT', Sequelize.cast(Sequelize.col('Password'), 'bytea'), 'AES_KEY'), "Password"]
                ]
            }).then(users => {
                return users.forEach(userObj => {
                    let user = userObj.dataValues;
                    let hash = bcrypt.hashSync(user.Password, 10);
                    return Db.models.Users.update({ Password: hash }, { where: { Id: user.Id } })
                })
            })
        }
    }
}
export default UserMutation;
