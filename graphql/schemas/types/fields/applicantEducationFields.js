import { GraphQLInt, GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import GraphQLDate from 'graphql-date';

const ApplicantEducationFields = {
	schoolType: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant School Type'
	},
	educationName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Education Name'
	},
	educationAddress: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Education Adress'
	},
	startDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Education Start Date'
	},
	endDate: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Education End Date'
	},
	graduated: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Is Graduated?'
	},
	degree: {
		type: GraphQLInt,
		description: 'Applicant Degree'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantEducationFields;
