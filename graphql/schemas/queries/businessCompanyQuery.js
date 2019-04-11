import { GraphQLList, GraphQLString, GraphQLBoolean, GraphQLInt } from 'graphql';
import { BusinessCompanyType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const businessCompanyQuery = {
    companiesByApplications: {
        type: new GraphQLList(BusinessCompanyType),
        description: 'List Companies records',
        args: {
            id: {
                type: GraphQLInt
            }
        },
        resolve(root, args) {
            return Db.models.BusinessCompany.findAll({
                include: [{
                    model: Db.models.Contacts,
                    required: true,
                    include: [{
                        model: Db.models.Applications,
                        required: true,
                        where: args
                    }]
                }]
            });
        }
    }
};

export default businessCompanyQuery;
