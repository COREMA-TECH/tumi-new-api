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
	ShiftWorkOrderMutation,
	ShiftDetailEmployeeMutation,
	MarkedEmployeesMutation,
	RolesFormsMutation,
	CatalogItemMutation,
	ConfigRegionsMutation,
	UserMutation
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
	ShiftWorkOrderQuery,
	MarkedEmployeesQuery,
	ApplicationEmployeesQuery,
	ContactsQuery,
	RolesQuery,
	FormsQuery,
	RolesFormsQuery,
	TemplateQuery,
	ShiftDetailEmployeesQuery,
	CatalogItemQuery,
	ConfigRegionsQuery,
	TimeElapsedQuery
} from './queries';
import { ShiftWorkOrderType, FormsType } from './types/operations/outputTypes';
import { FormsFields } from './types/fields';

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
		...ShiftWorkOrderQuery,
		...MarkedEmployeesQuery,
		...ApplicationEmployeesQuery,
		...ContactsQuery,
		...RolesQuery,
		...FormsQuery,
		...RolesFormsQuery,
		...TemplateQuery,
		...ShiftDetailEmployeesQuery,
		...CatalogItemQuery,
		...ConfigRegionsQuery,
		...TimeElapsedQuery,
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
		...ShiftWorkOrderMutation,
		...ShiftDetailEmployeeMutation,
		...MarkedEmployeesMutation,
		...RolesFormsMutation,
		...CatalogItemMutation,
		...ConfigRegionsMutation,
		...UserMutation
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
