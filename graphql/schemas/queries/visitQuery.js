import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { VisitType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const VisitQuery = {
    visits: {
        type: new GraphQLList(VisitType),
        description: 'List Visits',
        args: {
            id: {
                type: GraphQLInt
            },
            BusinessCompanyId: {
                type: GraphQLInt
            },
            OpManagerId: {
                type: GraphQLInt
            },
            isActive:{
                type: GraphQLBoolean
            }
        },
        resolve(root, args) {
            return Db.models.Visits.findAll({ 
                where: args,
                include: [
                    {
                        model: Db.models.BusinessCompany,
                        required: true
                    }
                ]
            });
        }
    }
};

export default VisitQuery;
