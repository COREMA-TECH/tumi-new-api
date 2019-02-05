import { GraphQLString } from 'graphql';

const Zipcodefields = {
    Zipcode: {
        type: (GraphQLString)
    },

    Lat: {
        type: (GraphQLString)
    },
    Long: {
        type: (GraphQLString)
    },
    City: {
        type: GraphQLString
    }
};

export default Zipcodefields;
