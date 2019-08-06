import { inputInsertTokens } from '../types/operations/insertTypes';
import { inputUpdateTokens } from '../types/operations/updateTypes';
import { TokenType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const TokenMutation = {
    addToken: {
        type: new GraphQLList(TokenType),
        description: 'Add token to database',
        args: {
            tokens: { type: new GraphQLList(inputInsertTokens) }
        },
        resolve(source, args) {
            return Db.models.Token.bulkCreate(args.tokens, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateToken: {
        type: TokenType,
        description: 'Update Token Record',
        args: {
            token: { type: inputUpdateTokens }
        },
        resolve(source, args) {

            return Db.models.Token
                .update(
                        args.token
                    ,
                    {
                        where: {
                            id: args.token.Id
                        },
                        returning: true
                    }
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
        }
    }
};

export default TokenMutation;
