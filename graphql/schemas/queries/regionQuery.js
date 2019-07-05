import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { CatalogItemType, worKOrdersByRegionType } from '../types/operations/outputTypes';
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
            Id_Catalog:{
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

                let dataRegion = [];
                let regionsDatas = [];

                regions.map(region => {
                    let regionItemName = region.dataValues.Name;
                    let regionItemId = region.dataValues.Id;
                    dataRegion[`${regionItemName}-${regionItemId}`] = {
                        id: regionItemId,
                        name: regionItemName,
                    } 

                    region.dataValues.BusinessCompanies.map(BusinessCompany => {
                        dataRegion[`${regionItemName}-${regionItemId}`].workOrders_count = BusinessCompany.dataValues.WorkOrders ? BusinessCompany.dataValues.WorkOrders.length : 0;
                        dataRegion[`${regionItemName}-${regionItemId}`].color = "#000000".replace(/0/g, () => {
                            return (~~(Math.random() * 16)).toString(16);
                        });
                    });

                });

                Object.keys(dataRegion).map(i => {
                    let region = dataRegion[i]; 
                    let regionObject = {
                        id: region.id,
                        name: region.name,
                        workOrders_count: region.workOrders_count || 0,
                        color: region.color
                    };
                    regionsDatas.push(regionObject);
                });

               return regionsDatas;
            });
		}
	}

}

export default RegionQuery;