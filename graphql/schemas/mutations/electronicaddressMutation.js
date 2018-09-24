import { iParamEA } from '../types/operations/insertTypes';
import { ElectronicAddressType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const ElectronicAddressMutation = {
	inselectronicaddress: {
		type: ElectronicAddressType,
		description: 'Insert an Electronic Address record',
		args: {
			iParamEA: { type: iParamEA }
		},
		resolve(source, args) {
			return Db.models.ElectronicAddress.create({
				Related_Table: args.iParamEA.Related_Table,
				Id_Entity: args.iParamEA.Id_Entity,
				Electronic_Address_Type: args.iParamEA.Electronic_Address_Type,
				Electronic_Address: args.iParamEA.Electronic_Address,
				IsPrimary: args.iParamEA.IsPrimary,
				IsActive: args.iParamEA.IsActive,
				User_Created: args.iParamEA.User_Created,
				User_Updated: args.iParamEA.User_Updated,
				Date_Created: args.iParamEA.Date_Created,
				Date_Updated: args.iParamEA.Date_Updated
			});
		}
	}
};

export default ElectronicAddressMutation;
