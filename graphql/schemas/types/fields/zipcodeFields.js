import { GraphQLString,GraphQLInt } from 'graphql';

const Zipcodefields = {
    Zipcode: {
        type: (GraphQLString)
    },
    State: {
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
    },
    countryId :{
		type: GraphQLInt
    },
    stateId :{
		type: GraphQLInt
	}
};

export default Zipcodefields;
