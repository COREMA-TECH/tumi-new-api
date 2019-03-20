import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { CatalogItemType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const getQueryForUniqueCatalog = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop])
            //Exclude startDate and endDate from filters
            if (!["Id"].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
            else
                newFilter = { ...newFilter, [prop]: { [Op.ne]: filter[prop] } };//Not equal to record Id
    }
    return newFilter;
}

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
            },
            Name: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.CatalogItem.findAll({ where: args });
        }
    },
    uniquecatalogitem: {
        type: new GraphQLList(CatalogItemType),
        description: 'Unique record in catalog item, different Id when edited',
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
            },
            Name: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.CatalogItem.findAll({ where: getQueryForUniqueCatalog(args) });
        }
    }
};

export default CatalogItemQuery;
