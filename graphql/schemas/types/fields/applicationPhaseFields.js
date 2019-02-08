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
    },
    createdAt: {
        type: (GraphQLString)
    },
    ShiftId: {
        type: (GraphQLInt),
    }
};

export default ApplicationPhaseFields;
