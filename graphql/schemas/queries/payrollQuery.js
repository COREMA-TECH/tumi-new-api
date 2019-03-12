import {GraphQLList} from 'graphql';
import {listPayrollType} from '../types/operations/outputTypes';
import models from '../../../models/';

const listPayrollsQuery = {
    listPayrolls: {
        type: new GraphQLList(listPayrollType),
        description: 'List payrolls',
        args: {},
        resolve(root, args) {
            return models.Payroll.findAll({})
        }
    }
};

export default listPayrollsQuery;