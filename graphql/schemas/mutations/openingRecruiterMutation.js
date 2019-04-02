import {insertOpeningRecruiterType} from '../types/operations/insertTypes';
import {listOpeningRecruiterType} from '../types/operations/outputTypes';

import Sequelize from 'sequelize';
import Db from '../../models/models';

const Op = Sequelize.Op;


const OpeningRecruiterMutation = {
    addOpeningRecruiter: {
        type: listOpeningRecruiterType,
        description: 'Add OpeningRecruiter',
        args: {
            openingRecruiter: { type: insertOpeningRecruiterType }
        },
        resolve(source, args) {
            return Db.models.OpeningRecruiter
                    .bulkCreate(args.openingRecruiter, {returning: true})
                    .then((ret) => {

                        return ret.map((data) => {
                            return data.dataValues;
                        });
                    });
        }
    },
};

export default OpeningRecruiterMutation;