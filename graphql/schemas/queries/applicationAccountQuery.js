import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean, GraphQLNonNull, GraphQLFloat } from 'graphql';
import { ApplicationAccountType } from '../types/operations/outputTypes';
import Db from '../../models/models';

import GraphQLDate from 'graphql-date';
import Sequelize from 'sequelize';

const Op = Sequelize.Op;

const ApplicationAccountQuery = {
    applicationAccounts: {
        type: new GraphQLList(ApplicationAccountType),
        description: "Get Accounts for current Application",
        args: {
            applicationId: {
                type: GraphQLInt,
                description: 'Application this account belongs to'
            },
            firstName: {
                type: GraphQLString,
                description: 'Name of the Employee'
            },
            lastName: {
                type: GraphQLString,
                description: 'Last name of the Employee'
            },
            city: {
                type: GraphQLInt,
                description: 'City'
            },
            state: {
                type: GraphQLInt,
                description: 'State'
            },
            zipcode: {
                type: GraphQLInt,
                description: 'Zipcode'
            },
            bankName: {
                type: GraphQLString,
                description: 'Bank Name'
            },
            accountNumber: {
                type: GraphQLInt,
                description: 'Account Number'
            },
            routingNumber: {
                type: GraphQLInt,
                description: 'Routing Number'
            },
            accountType: {
                type: GraphQLString,
                description: 'Type of Account'
            },
            amount: {
                type: GraphQLFloat,
                description: 'Amount'
            },
            amountType: {
                type: GraphQLString,
                description: 'Amount Type'
            },
            address: {
                type: GraphQLString,
                description: "address"
            }
        },
        resolve(root, args) {
			return Db.models.ApplicationAccount.findAll({ 
                where: args,
                include: [{
                    model: Db.models.ApplicationAccountDocument,
                }]
            });
		}
    }
}

export default ApplicationAccountQuery;