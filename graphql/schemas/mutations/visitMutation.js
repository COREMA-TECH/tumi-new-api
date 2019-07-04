import { inputInsertVisit } from '../types/operations/insertTypes';
import { inputUpdateVisit } from '../types/operations/updateTypes';
import { VisitType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const VisitMutation = {
    addVisit: {
        type: new GraphQLList(VisitType),
        description: 'Add visit to database',
        args: {
            visits: { type: new GraphQLList(inputInsertVisit) }
        },
        resolve(source, args) {
            return Db.models.Visits.bulkCreate(args.visits, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateVisit: {
        type: VisitType,
        description: 'Update Visit Record',
        args: {
            visit: { type: inputUpdateVisit }
        },
        resolve(source, args) {

            return Db.models.Visits
                .update(
                        args.visit
                    ,
                    {
                        where: {
                            id: args.visit.id
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

export default VisitMutation;
