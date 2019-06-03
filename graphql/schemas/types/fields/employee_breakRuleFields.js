import { GraphQLInt } from 'graphql';
import GraphQLDate from 'graphql-date';

const Employee_BreakRuleFields = {
    employeeId: {
        type: GraphQLInt,
        description: 'Employee this rule applies to'
    },
    breakRuleId: {
        type: GraphQLInt,
        description: 'Break rule applied to this employee'
    }
}

export default Employee_BreakRuleFields;