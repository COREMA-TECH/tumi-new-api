import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantMilitaryServiceFields = {
	branch: {
		type: GraphQLString,
		description: 'Military Service Branch'
	},
	startDate: {
		type: GraphQLDate,
		description: 'Military Service Start Date'
	},
	endDate: {
		type: GraphQLDate,
		description: 'Military Service End Date'
	},
	rankAtDischarge: {
		type: GraphQLString,
		description: 'Military Service Rank at Discharge'
	},
	typeOfDischarge: {
		type: GraphQLInt,
		description: 'Military Service Type of Discharge'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantMilitaryServiceFields;
