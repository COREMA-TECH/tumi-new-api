import { GraphQLList, GraphQLString, GraphQLIncludeDirective, GraphQLInt, GraphQLBoolean } from 'graphql';
import { TemplateType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const TemplateQuery = {
    template: {
        type: new GraphQLList(TemplateType),
        args: {
            id: { type: GraphQLInt },
            title: { type: GraphQLString },
        },
        resolve(root, args) {
            return Db.models.Template.findAll({ where: args });
        }
    }
}

export default TemplateQuery;