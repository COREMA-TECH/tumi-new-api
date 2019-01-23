import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { CatalogItemType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const CatalogItemQuery = {
    catalogitem: {
        type: new GraphQLList(CatalogItemType),
        description: 'List Catalog Items records',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
            Id_Entity: {
                type: GraphQLInt
            },
            Id_Catalog: {
                type: GraphQLInt
            },
            Id_Parent: {
                type: GraphQLInt
            },
            Value: {
                type: GraphQLString
            },
            Value01: {
                type: GraphQLString
            },
            Value02: {
                type: GraphQLString
            },
            Value03: {
                type: GraphQLString
            },
            Value04: {
                type: GraphQLString
            }
        },
        resolve(root, args) {

            if (args.Id_Parent >= 0) {
                args.Id_Parent = args.Id_Parent;
            } else {
                args.Id_Parent = null;
            }

            return Db.models.CatalogItem.findAll({ where: args });
        }
    }
};

export default CatalogItemQuery;
