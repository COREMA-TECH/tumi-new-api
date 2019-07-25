import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const EmployeeByHotelFields = {
    isDefault: {
        type: GraphQLBoolean
    },
    isActive: {
        type: GraphQLBoolean
    },
    EmployeeId: {
        type: GraphQLInt
    },
    BusinessCompanyId: {
        type: GraphQLInt
    }
};
export default EmployeeByHotelFields;
