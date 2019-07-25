import { inputInsertFeatureType } from '../types/operations/insertTypes';
import { inputUpdateFeatureType } from '../types/operations/updateTypes';
import { FeatureType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt } from 'graphql';

import Db from '../../models/models';

const FeatureMutation = {
    addFeature: {
        type: new GraphQLList(FeatureType),
        description: 'Add features to database',
        args: {
            features: { type: new GraphQLList(inputInsertFeatureType) }
        },
        resolve(source, args) {
            return Db.models.Feature.bulkCreate(args.features, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateFeature: {
        type: FeatureType,
        description: 'Update Feature Record',
        args: {
            feature: { type: inputUpdateFeatureType }
        },
        resolve(source, args) {

            return Db.models.Feature
                .update(
                    args.feature
                    ,
                    {
                        where: {
                            id: args.feature.id
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

export default FeatureMutation;
