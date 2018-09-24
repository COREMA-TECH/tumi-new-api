import { GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLList } from 'graphql';

import {
	ApplicantLanguagesFields,
	ApplicationFields,
	ElectronicAddressFields,
	ApplicantEducationFields,
	ApplicantPreviousEmploymentFields
} from '../fields';

const ApplicationType = new GraphQLObjectType({
	name: 'Applications',
	description: 'This is for application form',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Id'
			},
			...ApplicationFields,
			languages: {
				type: new GraphQLList(ApplicantLanguageType),
				resolve(application) {
					return application.getApplicantLanguages();
				}
			},
			educations: {
				type: new GraphQLList(ApplicantEducationType),
				resolve(application) {
					return application.getApplicantEducations();
				}
			},
			employments: {
				type: new GraphQLList(ApplicantPreviousEmploymentType),
				resolve(application) {
					return application.getApplicantPreviousEmployments();
				}
			}
		};
	}
});

const ApplicantLanguageType = new GraphQLObjectType({
	name: 'ApplicantLanguages',
	description: 'This is for Applicant Languages Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Language Id'
			},
			...ApplicantLanguagesFields,
			application: {
				type: ApplicationType,
				resolve(applicantLanguage) {
					return applicantLanguage.getApplication();
				}
			}
		};
	}
});

const ApplicantEducationType = new GraphQLObjectType({
	name: 'ApplicantEducations',
	description: 'This is for Applicant Educations Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantEducationFields,
			application: {
				type: ApplicationType,
				resolve(applicantEducation) {
					return applicantEducation.getApplication();
				}
			}
		};
	}
});

const ApplicantPreviousEmploymentType = new GraphQLObjectType({
	name: 'ApplicantPreviousEmployment',
	description: 'This is for Applicant Employments Table',
	fields: () => {
		return {
			id: {
				type: new GraphQLNonNull(GraphQLInt),
				description: 'Applicant Education Id'
			},
			...ApplicantPreviousEmploymentFields,
			application: {
				type: ApplicationType,
				resolve(applicantPreviousEmployment) {
					return applicantPreviousEmployment.getApplication();
				}
			}
		};
	}
});
const ElectronicAddressType = new GraphQLObjectType({
	name: 'ElectronicAddress',
	description: 'This is for electronic address',
	fields: {
		Id: {
			type: new GraphQLNonNull(GraphQLInt)
		},
		...ElectronicAddressFields
	}
});

export {
	ApplicationType,
	ApplicantLanguageType,
	ElectronicAddressType,
	ApplicantEducationType,
	ApplicantPreviousEmploymentType
};
