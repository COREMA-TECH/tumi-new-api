import { inputInsertCompanyPreference } from '../types/operations/insertTypes';
import { inputUpdateCompanyPreference } from '../types/operations/updateTypes';
import { CompanyPreferenceType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const CompanyPreferenceMutation = {
	addCompanyPreference: {
		type: new GraphQLList(CompanyPreferenceType),
		description: 'Add Company Preference record to database',
		args: {
			companyPreference: { type: new GraphQLList(inputInsertCompanyPreference) }
		},
		resolve(source, args) {
			return Db.models.CompanyPreferences
				.bulkCreate(args.companyPreference, { returning: true })
				.then((companyPreference) => {
					return companyPreference.map((compPref) => {
						return compPref.dataValues;
					});
				});
		}
	},
	updateCompanyPreference: {
		type: CompanyPreferenceType,
		description: 'Update Company Preference Record Info',
		args: {
			companyPreference: { type: inputUpdateCompanyPreference }
		},
		resolve(source, args) {
			return Db.models.CompanyPreferences
				.update(
					{
						charge: args.companyPreference.charge,
						PeriodId: args.companyPreference.PeriodId,
						amount: args.companyPreference.amount,
						EntityId: args.companyPreference.EntityId,
						FiscalMonth1: args.companyPreference.FiscalMonth1,
						FiscalMonth2: args.companyPreference.FiscalMonth2,
						Timezone: args.companyPreference.Timezone
					},
					{
						where: {
							id: args.companyPreference.id
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	}
};

export default CompanyPreferenceMutation;
