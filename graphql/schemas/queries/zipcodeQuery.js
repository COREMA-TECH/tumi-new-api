import { GraphQLList, GraphQLString } from 'graphql';
import { ZipcodeType,CoordenadasType } from '../types/operations/outputTypes';
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
            return Db.models.Zipcode.findAll({ where: args,
                limit: 1 }
                
            );
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
    },
    Coordenadas:{
        type: new GraphQLList(CoordenadasType),
        description: 'List Coordenadas records',
        args: {
            zipCode: {
                type: GraphQLString
            }
        },
        resolve(root, args) {
            return Db.models.Coordenadas.findAll({ where: args }
                
            );
        }
    }

};

export default ZipcodeQuery;
