import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';

import { inputInsertBreakRuleDescriptionType } from '../types/operations/insertTypes';
import { BreakRuleDetailType } from '../types/operations/outputTypes';
import { inputUpdateBreakRuleDetail } from '../types/operations/updateTypes';

const BreakRuleDetailMutation = {
    addBreakRuleDetail: {
		type: BreakRuleDetailType,
		description: 'Add break rule detail record to database',
		args: {
			breakRuleDetail: { type: inputInsertBreakRuleDescriptionType }
		},
		resolve(source, args) {
			console.log("Variables ", args)
			return Db.models.BreakRuleDetail.create(args.breakRuleDetail);
		}
    },

    updateBreakRuleDetail: {
        type: BreakRuleDetailType,
        description: 'Update break rule detail',
        args: {
            breakRuleDetail: { type: inputUpdateBreakRuleDetail }
        },
        resolve(source, args) {
			console.log("Updating ", args)
            
            const { id, shiftReached, isRepeating, days, breakStartTime, breakPlacement } = args.breakRuleDetail;

            return Db.models.BreakRuleDetail.update({ shiftReached, isRepeating, days, breakStartTime, breakPlacement }, {
                where: {
                    id
                },
                returning: true
            })
            .then(function ([rowsUpdate, [record]]) {
                if (record) return record.dataValues;
                else return null;
            });
		}
    },
}

export default BreakRuleDetailMutation;