import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { CatalogItemType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const regionQuery = {
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
    }
}

export default regionQuery;