import { GraphQLInt, GraphQLList, GraphQLInputObjectType } from 'graphql';
import { WorkOrderType } from '../types/operations/outputTypes';
import { inputInsertWorkOrderCompany } from '../types/operations/insertTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const inputQueryWorkOrder = new GraphQLInputObjectType({
	name: 'inputQueryWorkOrder',
	description: 'Inputs for Work Order Insert',

	fields: {
		id: { type: GraphQLInt },
		startDate: { type: GraphQLDate },
		endDate: { type: GraphQLDate },
		status: { type: GraphQLInt }
	}
});

const WorkOrderQuery = {
	workOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'List work order records',
		args: {
			workOrder: { type: inputQueryWorkOrder },
			workOrderCompany: { type: inputInsertWorkOrderCompany }
		},
		resolve(root, args) {

			return Db.models.WorkOrder.findAll({ 
				where: args.workOrder,
				include: [{
					model: Db.models.BusinessCompany,
					as: 'BusinessCompanyWO',
					where: args.workOrderCompany
				}]
			});
		}
	}
};

export default WorkOrderQuery;
