import { GraphQLInt, GraphQLNonNull, GraphQLInputObjectType } from 'graphql';
import { ApplicantLanguagesFields, ApplicationFields, ApplicantEducationFields } from '../fields';

const inputUpdateApplication = new GraphQLInputObjectType({
	name: 'inputUpdateApplication',
	description: 'Inputs for Application Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicationFields
	}
});

const inputUpdateApplicantLanguage = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantLanguage',
	description: 'Inputs for Applicant Languages Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantLanguagesFields
	}
});

const inputUpdateApplicantEducation = new GraphQLInputObjectType({
	name: 'inputUpdateApplicantEducation',
	description: 'Inputs for Applicant Education Mutation',

	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...ApplicantEducationFields
	}
});

export { inputUpdateApplicantLanguage, inputUpdateApplication, inputUpdateApplicantEducation };
