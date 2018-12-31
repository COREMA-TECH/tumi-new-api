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
	WorkOrderPositionMutation,
	ApplicationPhaseMutation,
	HolidayMutation,
	EmployeesMutation,
	ShiftMutation,
	ShiftDetailMutation,
	ShiftWorkOrderMutation
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
	WorkOrderPositionQuery,
	ZipcodeQuery,
	ApplicationPhaseQuery,
	phaseworkOrderQuery,
	HolidayQuery,
	EmployeesQuery,
	ShiftQuery,
	ShiftDetailsQuery,
	ShiftWorkOrderQuery

} from './queries';
import { ShiftWorkOrderType } from './types/operations/outputTypes';

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
		...WorkOrderPositionQuery,
		...ZipcodeQuery,
		...ApplicationPhaseQuery,
		...phaseworkOrderQuery,
		...HolidayQuery,
		...EmployeesQuery,
		...ShiftQuery,
		...ShiftDetailsQuery,
		...ShiftWorkOrderQuery
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
		...WorkOrderPositionMutation,
		...ApplicationPhaseMutation,
		...HolidayMutation,
		...EmployeesMutation,
		...ShiftMutation,
		...ShiftDetailMutation,
		...ShiftWorkOrderMutation
	}
});

const IndexSchema = new GraphQLSchema({
	query: RootQuery,
	mutation: RootMutation
});

const MergedSchema = mergeSchemas({
	schemas: [IndexSchema, NativeSchema]
});

export default MergedSchema;
