import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { NativeSchema } from './types/operations/NativeSchema';

import { mergeSchemas } from 'graphql-tools';

import {
	ApplicationMutation,
	ApplicationAccountMutation,
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
	ApplicantW4Mutation,
	ApplicantI9Mutation,
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
	UserMutation,
	ContactsMutation,
	payrollMutation,
	OpeningRecruiterMutation,
	SmsLogMutation,
	ApplicantIndependentContractMutation,
	BreakRuleMutation,
	BreakRuleDetailMutation,
	VisitMutation,
	ApplicantVerificationLetterMutation,
	EmployeeByHotelMutation,
	FormMutation,
	FeatureMutation,
	ContractMutation
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
	ApplicantW4Query,
	ApplicantI9Query,
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
	MarkedEmployeesDetailQuery,
	ApplicationEmployeesQuery,
	ContactsQuery,
	RolesQuery,
	FormsQuery,
	RolesFormsQuery,
	TemplateQuery,
	ShiftDetailEmployeesQuery,
	CatalogItemQuery,
	ConfigRegionsQuery,
	TimeElapsedQuery,
	UserQuery,
	payrollQuery,
	OpeningRecruiterQuery,
	SmsLogQuery,
	businessCompanyQuery,
	MarkedEmployeesConsolidated,
	MarkedEmployeesApproved,
	ApplicantIndependentContractQuery,
	BreakRuleDetailQuery,
	BreakRuleQuery,
	TransactionLogQuery,
	ApplicationAccountQuery,
	ApplicationSummaryQuery,
	RegionQuery,
	VisitQuery,
	EmployeeByHotelQuery,
	FeatureQuery,
	ContractQuery
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
		...ApplicantW4Query,
		...ApplicantI9Query,
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
		...MarkedEmployeesDetailQuery,
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
		...UserQuery,
		...payrollQuery,
		...OpeningRecruiterQuery,
		...SmsLogQuery,
		...businessCompanyQuery,
		...MarkedEmployeesConsolidated,
		...MarkedEmployeesApproved,
		...ApplicantIndependentContractQuery,
		...BreakRuleQuery,
		...BreakRuleDetailQuery,
		...TransactionLogQuery,
		...ApplicationAccountQuery,
		...ApplicationSummaryQuery,
		...RegionQuery,
		...VisitQuery,
		...EmployeeByHotelQuery,
		...FeatureQuery,
		...ContractQuery
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
		...ApplicantW4Mutation,
		...ApplicantI9Mutation,
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
		...UserMutation,
		...ContactsMutation,
		...payrollMutation,
		...OpeningRecruiterMutation,
		...SmsLogMutation,
		...ApplicationAccountMutation,
		...ApplicantIndependentContractMutation,
		...BreakRuleMutation,
		...BreakRuleDetailMutation,
		...VisitMutation,
		...ApplicantVerificationLetterMutation,
		...EmployeeByHotelMutation,
		...FormMutation,
		...FeatureMutation,
		...ContractMutation
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
