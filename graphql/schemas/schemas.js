import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { NativeSchema } from './types/operations/NativeSchema';

import { mergeSchemas } from 'graphql-tools';

import {
	ApplicationMutation,
	ApplicantLanguageMutation,
	ElectronicAddressMutation,
	ApplicantEducationMutation,
	ApplicantPreviousEmploymentMutation,
	ApplicantMilitaryServiceMutation,
	ApplicantSkillMutation,
	CompanyPreferenceMutation,
	ApplicantIdealJobMutation,
	ApplicantDisclosureMutation,
	ApplicantConductCodeMutation,
	ApplicantBackgroundCheckMutation,
	ApplicantHarassmentPolicyMutation,
	ApplicantWorkerCompensationMutation,
	ApplicantDocumentMutation,
	WorkOrderMutation,
	WorkOrderPositionMutation
} from './mutations';
import {
	ApplicationQuery,
	ApplicantLanguageQuery,
	ElectronicAddressQuery,
	ApplicantEducationQuery,
	ApplicantPreviousEmploymentQuery,
	ApplicantMilitaryServiceQuery,
	ApplicantSkillQuery,
	CompanyPreferenceQuery,
	ApplicantIdealJobQuery,
	ApplicantDisclosureQuery,
	ApplicantConductCodeQuery,
	ApplicantBackgroundCheckQuery,
	ApplicantHarassmentPolicyQuery,
	ApplicantWorkerCompensationQuery,
	ApplicantDocumentQuery,
	WorkOrderQuery,
	WorkOrderPositionQuery
} from './queries';

const RootQuery = new GraphQLObjectType({
	name: 'Query',
	description: 'Root Query',
	fields: {
		...ApplicationQuery,
		...ApplicantLanguageQuery,
		...ElectronicAddressQuery,
		...ApplicantEducationQuery,
		...ApplicantPreviousEmploymentQuery,
		...ApplicantMilitaryServiceQuery,
		...ApplicantSkillQuery,
		...CompanyPreferenceQuery,
		...ApplicantIdealJobQuery,
		...ApplicantDisclosureQuery,
		...ApplicantConductCodeQuery,
		...ApplicantBackgroundCheckQuery,
		...ApplicantHarassmentPolicyQuery,
		...ApplicantWorkerCompensationQuery,
		...ApplicantDocumentQuery,
		...WorkOrderQuery,
		...WorkOrderPositionQuery
	}
});
const RootMutation = new GraphQLObjectType({
	name: 'Mutation',
	description: 'Root Mutation',
	fields: {
		...ApplicationMutation,
		...ApplicantLanguageMutation,
		...ElectronicAddressMutation,
		...ApplicantEducationMutation,
		...ApplicantPreviousEmploymentMutation,
		...ApplicantMilitaryServiceMutation,
		...ApplicantSkillMutation,
		...CompanyPreferenceMutation,
		...ApplicantIdealJobMutation,
		...ApplicantDisclosureMutation,
		...ApplicantConductCodeMutation,
		...ApplicantBackgroundCheckMutation,
		...ApplicantHarassmentPolicyMutation,
		...ApplicantWorkerCompensationMutation,
		...ApplicantDocumentMutation,
		...WorkOrderMutation,
		...WorkOrderPositionMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

const MergedSchema = mergeSchemas({
	schemas: [ IndexSchema, NativeSchema ]
});

export default MergedSchema;
