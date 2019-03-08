import { GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLNonNull } from 'graphql';
import GraphQLDate from 'graphql-date';



const payrollFields = {
    weekStart: {
        type: GraphQLInt
    },
    payPeriod: {
        type: GraphQLInt
    },
    lastPayPeriod: {
        type: GraphQLDate
    },

};

export default payrollFields;