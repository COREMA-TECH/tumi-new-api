import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';

const ApplicantSkillFields = {
	description: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Skill Description'
	},
	level: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Skil Level'
	},
	ApplicationId: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Application Id'
	}
};

export default ApplicantSkillFields;
