import { GraphQLInt, GraphQLList } from 'graphql';
import { WorkOrderType } from '../types/operations/outputTypes';
import Db from '../../models/models';
import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const WorkOrderQuery = {
	workOrder: {
		type: new GraphQLList(WorkOrderType),
		description: 'List work order records',
		args: {
			id: {
				type: GraphQLInt
			},
			IdEntity: {
				type: GraphQLInt
			},
			date: {
				type: GraphQLInt
			},
			status: {
				type: GraphQLInt
			},
			startDate: {
				type: GraphQLDate
			},
			endDate: {
				type: GraphQLDate
			}
		},
		resolve(root, args) {
			if (args.startDate) args.startDate = {[Op.gte]: args.startDate}
			if (args.endDate) args.endDate = {[Op.lte]: args.endDate}

			return Db.models.WorkOrder.findAll({ where: args });
		}
	}
};

export default WorkOrderQuery;
