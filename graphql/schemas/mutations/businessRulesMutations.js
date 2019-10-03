import Db from '../../models/models';
import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

import { inputBusinessRule } from '../types/operations/insertTypes';
import { BusinessRuleType } from '../types/operations/outputTypes';
import { inputUpdateBusinessRule } from '../types/operations/updateTypes';

const BusinessRuleMutations = {
    addBusinesRule: {
        type: BusinessRuleType,
        description: "Adds a new Business Rule to the DB",
        args: {
            input: {
                type: inputBusinessRule
            }
        },
        resolve(source, args){
            const {input: rule} = args;
            return Db.models.BusinessRule.create(rule)
                .then(created => {
                    return created;
                })
        }
    },

    updateBusinessRule: {
        type: BusinessRuleType,
        description: "Adds a new Business Rule to the DB",
        args: {
            id: { type: GraphQLInt },
            input: { type: inputBusinessRule }
        },
        resolve(source, args){
            const {catalogItemId, name, multiplier, baseIncrement, startAfterHours, days, startTime, endTime, isActive} = args.input;
            return Db.models.BusinessRule.update({catalogItemId, name, multiplier, baseIncrement, startAfterHours, days, startTime, endTime, isActive}, {
                where: {
                    id: args.id
                },
                returning: true
            }).then(function ([rowsUpdate, [record]]) {
                if (record) return record.dataValues;
                else return null;
            });
        }
    },

    toggleBusinessRule: {
        type: BusinessRuleType,
        description: "Enable / disable rule",
        args: {
            id: {type: GraphQLInt},
            isActive: {type: GraphQLBoolean}
        },
        resolve(source, args){
            return Db.models.BusinessRule.update({isActive: args.isActive}, {
                where: { id: args.id },
                returning: true
            })
            .then(function ([rowsUpdate, [record]]) {
                if (record) return record.dataValues;
                else return null;
            });
        }
    }
}

export default BusinessRuleMutations;