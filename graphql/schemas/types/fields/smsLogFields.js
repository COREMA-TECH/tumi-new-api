import { GraphQLString, GraphQLInt } from 'graphql';

const SmsLogFields = {
    number: {
        type: GraphQLString
    },
    request: {
        type: GraphQLString
    },
    response: {
        type: GraphQLString
    },
    EmployeeId: {
        type: GraphQLInt
    },
    ShiftId: {
        type: GraphQLInt
    }
}

export default SmsLogFields;