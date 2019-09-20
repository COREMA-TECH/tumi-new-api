import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';
import { inputUpdateRegionsUsers } from '../types/operations/updateTypes';
import { RegionsUsersType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const RegionsUsersQuery = {
    regionsUsers: {
        type: new GraphQLList(RegionsUsersType),
        description: 'List Regions by Users',
        args: {
            regionUser: { type: inputUpdateRegionsUsers }
        },
        resolve(root, args) {
            return Db.models.RegionsUsers.findAll({ 
                where: args.regionUser,
                include: [
                    {
                        model: Db.models.Users,
                        required: true
                    },
                    {
                        model: Db.models.CatalogItem,
                        required: true
                    }
                ]
            });
        }
    },
    regionsUsersByUsersId: {
        type: new GraphQLList(RegionsUsersType),
        description: 'List Regions by User by UsersId',
        args: {
            UserId: { type: new GraphQLList(GraphQLInt) },
            isActive: { type: GraphQLBoolean } 
        },
        async resolve(root, args) {
            let result = await Db.models.RegionsUsers.findAll({ 
                where: args,
                include: [
                    {
                        model: Db.models.Users,
                        required: true
                    },
                    {
                        model: Db.models.CatalogItem,
                        required: true
                    }
                ]
            });

            return result;
        }
    }
};

export default RegionsUsersQuery;
