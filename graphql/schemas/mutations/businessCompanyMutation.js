import Db from '../../models/models';
import { graphql, GraphQLInt, GraphQLString, GraphQLBoolean, GraphQLList } from 'graphql';

import { inputInsertBusinessCompany } from '../types/operations/insertTypes';
import { BusinessCompanyType } from '../types/operations/outputTypes';
import { inputUpdateBusinessCompany } from '../types/operations/updateTypes';

const BusinessCompanyMutation = {
    updateBusinessCompany: {
        type: BusinessCompanyType,
        description: 'Update BusinessCompany',
        args: {
			businessCompany: {type: inputUpdateBusinessCompany}
        },
        async resolve(source, args) {
            return await Db.models.BusinessCompany.update(args.businessCompany, {
                where: {Id: args.businessCompany.Id},
                returning: true
            });
		}
    },
}

export default BusinessCompanyMutation;