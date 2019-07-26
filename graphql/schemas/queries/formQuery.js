import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { FormsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const FormsQuery = {
    forms: {
        type: new GraphQLList(FormsType),
        description: 'List of Forms',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
            ParentId: {
                type: GraphQLInt
            },
            show: {
                type: GraphQLBoolean
            }

        },
        resolve(root, args) {
            return Db.models.Forms.findAll({ where: args, order: [['sort', 'ASC']] });
        }
    }
};

export default FormsQuery;
