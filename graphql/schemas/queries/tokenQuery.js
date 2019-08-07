import { GraphQLInt, GraphQLList } from 'graphql';
import { TokenType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const TokenQuery = {
    tokens: {
        type: new GraphQLList(TokenType),
        description: 'Token list',
        args: {
            Id: { 
                type: GraphQLInt 
            },
            Id_Contract: { 
                type: GraphQLInt 
            }
        },
        resolve(root, args) {
            return Db.models.Token.findAll({ 
                where: args
            });
        }
    }
};

export default TokenQuery;
