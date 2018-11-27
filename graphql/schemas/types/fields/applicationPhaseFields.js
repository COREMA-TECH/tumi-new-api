import { GraphQLString, GraphQLInt } from 'graphql';

const ApplicationPhaseFields = {
    UserId: {
        type: (GraphQLInt),
    },
    ReasonId: {
        type: (GraphQLInt),
    },
    StageId: {
        type: (GraphQLInt),
    },
    ApplicationId: {
        type: (GraphQLInt),
    },
    WorkOrderId: {
        type: (GraphQLInt),
    },
    Comment: {
        type: (GraphQLString),
    }
};

export default ApplicationPhaseFields;
