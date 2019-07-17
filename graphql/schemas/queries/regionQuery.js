import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { CatalogItemType, worKOrdersByRegionType, employeesByHotel } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const RegionQuery = {
    doughnutRegion: {
        type: new GraphQLList(CatalogItemType),
        description: 'List Catalog Items records',
        args: {
            Id: {
                type: GraphQLInt
            },
            Id_Catalog: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.CatalogItem.findAll({ where: args }).then(data => {

            });
        }
    },

    worKOrdersByRegion: {
        type: new GraphQLList(worKOrdersByRegionType),
        description: 'List work order by regions',
        resolve(root, args) {
            return Db.models.CatalogItem.findAll({
                where: { Id_Catalog: 4 },
                include: [{
                    model: Db.models.BusinessCompany,
                    include: [{
                        model: Db.models.WorkOrder
                    }]
                }]
            }).then(regions => {
                const regionsArray = regions.map(region => {
                    let regionInfo = {
                        id: region.dataValues.Id,
                        name: region.dataValues.Name.trim(),
                        workOrders_count: 0,
                        color: "#000000".replace(/0/g, () => {
                            return (~~(Math.random() * 16)).toString(16);
                        })
                    }

                    regionInfo.workOrders_count = region.dataValues.BusinessCompanies.length === 0 ? 0 : region.dataValues.BusinessCompanies.reduce((acc, curr) => {
                        return acc + curr.dataValues.WorkOrders.length;
                    }, 0);

                    return regionInfo;
                });

                return regionsArray;
            });
        }
    },

    worKOrdersByCategory: {
        type: new GraphQLList(worKOrdersByRegionType),
        description: 'List work order by categories',
        resolve(root, args) {
            return Db.models.CatalogItem.findAll({
                where: { Id_Catalog: 8 },
                include: [{
                    model: Db.models.WorkOrder,
                    include:[{ model: Db.models.PositionRate }]
                }]
            }).then(categories => {
                const categoriesArray = categories.map(category => {
                    // console.log(category.dataValues.WorkOrders);
                    
                    let categoryInfo = {
                        id: category.dataValues.Id,
                        name: (category.dataValues.WorkOrders && category.dataValues.WorkOrders.length > 0) ? category.dataValues.WorkOrders[0].PositionRate.dataValues.Position.trim() : '',
                        workOrders_count: 0,
                        color: "#000000".replace(/0/g, () => {
                            return (~~(Math.random() * 16)).toString(16);
                        })
                    }

                    categoryInfo.workOrders_count = category.dataValues.WorkOrders.length === 0 ? 0 : category.dataValues.WorkOrders.length;
                    return categoryInfo;

                }).filter(item => item.workOrders_count > 0)

                return categoriesArray;
            });
        }
    },

    employeesByHotel: {
        type: new GraphQLList(employeesByHotel),
        description: 'List employees by hotels',
        resolve(root, args) {
            return Db.models.BusinessCompany.findAll({
                include: [{
                    model: Db.models.Employees,
                }]
            }).then(hotels => {
                const hotelsArray = hotels.map(hotel => {
                    let hotelInfo = {
                        id: hotel.dataValues.Id,
                        name: hotel.dataValues.Name.trim(),
                        employeeCount: 0,
                        color: "#000000".replace(/0/g, () => {
                            return (~~(Math.random() * 16)).toString(16);
                        })
                    }

                    hotelInfo.employeeCount = hotel.dataValues.Employees.length;
                    return hotelInfo;
                })
                    .filter(item => item.employeeCount > 0);

                return hotelsArray;
            });
        }
    },

    getHiredEmployeesCount: {
        type: GraphQLInt,
        description: "Amount of hired employees",
        resolve(root, args) {
            return Db.models.Employees.count({
                where: { hireDate: { [Op.ne]: null } }
            }).then(count => {
                return count;
            });
        }
    }
}

export default RegionQuery;