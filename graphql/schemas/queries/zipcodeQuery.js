import { GraphQLList, GraphQLString } from 'graphql';
import { ZipcodeType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ZipcodeQuery = {
    zipcode: {
        type: new GraphQLList(ZipcodeType),
        description: 'List Zipcode records',
        args: {
            Zipcode: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.Zipcode.findAll({ where: args });
        }
    },
    zipcode_City_State: {
        type: new GraphQLList(ZipcodeType),
        description: 'List Zipcode records',
        args: {
            Zipcode: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.Zipcode.findAll({ where: {Zipcode:args.Zipcode,countryId:{ $ne: null} } });
        }
    }

};

export default ZipcodeQuery;
