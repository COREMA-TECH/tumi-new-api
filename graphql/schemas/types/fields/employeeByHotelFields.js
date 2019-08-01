import { GraphQLInt, GraphQLBoolean } from 'graphql';

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
