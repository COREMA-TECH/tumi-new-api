import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

import { inputInsertBreakRuleType } from '../types/operations/insertTypes';
import { BreakRuleType } from '../types/operations/outputTypes';
import { inputUpdateBreakRule } from '../types/operations/updateTypes';

const BreakRuleMutation = {
    addBreakRule: {
		type: BreakRuleType,
		description: 'Add break rule record to database',
		args: {
			breakRule: { type: inputInsertBreakRuleType },
			employees: { type: GraphQLList(GraphQLInt) }
		},
		resolve(source, args) {
			const {breakRule, employees} = args;

			return Db.models.BreakRule.create(breakRule)
			.then(createdBreakRule => {
				let employeesBreakRules = employees.map(employeeId => {
					return { employeeId: employeeId, breakRuleId: createdBreakRule.id }
				});

				Db.models.Employee_BreakRule.bulkCreate(employeesBreakRules, { returning: true });
				return createdBreakRule;
			});
		}
    },
    
    updateBreakRule: {
        type: BreakRuleType,
        description: 'Update break rule',
        args: {
			breakRule: { type: inputUpdateBreakRule },
			employees: { type: GraphQLList(GraphQLInt) }
        },
        resolve(source, args) {
			console.log("Updating ", args)
            
			const { id, name, code, isPaid, isAutomatic, lenght, isActive = true } = args.breakRule;
			const { employees }	= args;
			
			Db.models.Employee_BreakRule.destroy({
				where: {
					breakRuleId: id
				}
			});

            return Db.models.BreakRule.update({ name, code, isPaid, isAutomatic, lenght, isActive }, {
                where: {
                    id
                },
                returning: true
            })
            .then(function ([rowsUpdate, [record]]) {
				let employeesBreakRules = employees.map(employeeId => {
					return { employeeId: employeeId, breakRuleId: id }
				});

				Db.models.Employee_BreakRule.bulkCreate(employeesBreakRules, { returning: true });

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