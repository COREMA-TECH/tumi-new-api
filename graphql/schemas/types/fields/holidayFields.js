import { GraphQLInt, GraphQLString, GraphQLNonNull, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const phaseworkOrderFields = {
    title: {
        type: new GraphQLNonNull(GraphQLString)
    },
    startDate: {
        type: new GraphQLNonNull(GraphQLDate)
    },
    endDate: {
        type: new GraphQLNonNull(GraphQLDate)
    },
    description: {
        type: new GraphQLNonNull(GraphQLString)
    },
    CompanyId: {
        type: new GraphQLNonNull(GraphQLInt)
    },
    anually: {
        type: new GraphQLNonNull(GraphQLBoolean)
    },
    weekDays: {
        type: new GraphQLNonNull(GraphQLString)
    },
    weekNumbers: {
        type: new GraphQLNonNull(GraphQLString)
    },
    months: {
        type: new GraphQLNonNull(GraphQLString)
    },
    calendarDays: {
        type: new GraphQLNonNull(GraphQLString)
    },
};

export default phaseworkOrderFields;
