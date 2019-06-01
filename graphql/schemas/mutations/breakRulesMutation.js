import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean } from 'graphql';

import { inputInsertBreakRuleType } from '../types/operations/insertTypes';
import { BreakRuleType } from '../types/operations/outputTypes';
import { inputUpdateBreakRule } from '../types/operations/updateTypes';

const BreakRuleMutation = {
    addBreakRule: {
		type: BreakRuleType,
		description: 'Add break rule record to database',
		args: {
			breakRule: { type: inputInsertBreakRuleType }
		},
		resolve(source, args) {
			console.log("Variables ", args)
			return Db.models.BreakRule.create(args.breakRule);
		}
    },
    
    updateBreakRule: {
        type: BreakRuleType,
        description: 'Update break rule',
        args: {
            breakRule: { type: inputUpdateBreakRule }
        },
        resolve(source, args) {
			console.log("Updating ", args)
            
            const { id, name, code, isPaid, isAutomatic, lenght, isActive = true } = args.breakRule;

            return Db.models.BreakRule.update({ name, code, isPaid, isAutomatic, lenght, isActive }, {
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

    disableBreakRule: {
		type: BreakRuleType,
		description: 'Disable Break rule',
		args: {
			id: { type: GraphQLInt },
			isActive:{ type: GraphQLBoolean }
		},
		resolve(source, args) {
			return Db.models.BreakRule
				.update(
					{
						isActive: args.isActive
					},
					{
						where: {
							id: args.id
						},
						returning: true
					}
                )
                .then(function ([rowsUpdate, [record]]) {
                    if (record) return record.dataValues;
                    else return null;
                });
		}
	},
}

export default BreakRuleMutation;