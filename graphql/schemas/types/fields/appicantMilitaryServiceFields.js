import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantMilitaryServiceFields = {
	branch: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Military Service Branch'
	},
	startDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Military Service Start Date'
	},
	endDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Military Service End Date'
	},
	rankAtDischarge: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Military Service Rank at Discharge'
	},
	typeOfDischarge: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Military Service Type of Discharge'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantMilitaryServiceFields;
