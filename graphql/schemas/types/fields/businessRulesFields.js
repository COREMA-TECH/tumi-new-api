import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean, graphql, GraphQLFloat } from 'graphql';

const BusinessRulesFields = {
    catalogItemId: {
        type: GraphQLInt,
        description: "Type of Business Rule",        
    },
    name: {
        type: GraphQLString,
        description: "Rule name"
    },
    multiplier: {
        type: GraphQLFloat,
        description: "Base salary proportion",        
    },
    baseIncrement: {
        type: GraphQLFloat,
        description: "Specific amount increased to base salary"
    },
    startAfterHours: {
        type: GraphQLFloat,
        description: "After how many worked hours should this rule apply?"
    },
    days: {
        type: GraphQLString,
        description: "On which week days should this rule apply?"
    },
    startTime: {
        type: GraphQLString,
        description: "Rule takes effect starting at this hour"
    },
    endTime: {
        type: GraphQLString,
        description: "Rule stops taking effect at this hour"
    },
    type: {
        type: GraphQLString
    },
    isActive: {
        type: GraphQLBoolean
    }
}

export default BusinessRulesFields;