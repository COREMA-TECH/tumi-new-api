//const { resolver } = require('graphql-sequelize');
import {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLSchema,
	GraphQLBoolean
} from 'graphql';
import GraphQLDate from 'graphql-date';

import Db from './models';

const applicationFields = {
	firstName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant First Name'
	},
	middleName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Middle Name'
	},
	lastName: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Last Name'
	},
	date: {
		type: new GraphQLNonNull(GraphQLDate),
		description: 'Applicant Date'
	},
	streetAddress: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Street Address'
	},
	aptNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Apt Number'
	},
	city: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant City'
	},
	state: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant State'
	},
	zipCode: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Zip Code'
	},
	homePhone: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Phone Home'
	},
	cellPhone: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Cell Phone'
	},
	socialSecurityNumber: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Social Security Number'
	},
	positionApplyingFor: {
		type: new GraphQLNonNull(GraphQLInt),
		description: 'Applicant Possition Applying for'
	},
	dateAvailable: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Date Avalilable'
	},
	scheduleRestrictions: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Schedule Restrictions'
	},
	scheduleExplain: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant scheduleExplain'
	},
	convicted: {
		type: new GraphQLNonNull(GraphQLBoolean),
		description: 'Applicant Convicted'
	},
	convictedExplain: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Convicted Explanation'
	},
	comment: {
		type: new GraphQLNonNull(GraphQLString),
		description: 'Applicant Comment'
	}
};
const applicantionType = new GraphQLObjectType({
	name: 'Applications',
	description: 'This is for application form',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...applicationFields
	}
});

const Query = new GraphQLObjectType({
	name: 'Query',
	description: 'This is a root query',
	fields: () => {
		return {
			applications: {
				type: new GraphQLList(applicantionType),
				args: {
					id: {
						type: GraphQLInt
					},
					firstName: {
						type: GraphQLString
					}
				},
				resolve(root, args) {
					return Db.models.Applications.findAll({ where: args });
				}
			}
		};
	}
});

const Mutation = new GraphQLObjectType({
	name: 'Mutations',
	description: 'Functions to set stuff',
	fields() {
		return {
			addApplication: {
				type: applicantionType,
				args: applicationFields,
				resolve(source, args) {
					return Db.models.Applications.create({
						firstName: args.firstName,
						middleName: args.middleName,
						lastName: args.lastName,
						date: args.date,
						streetAddress: args.streetAddress,
						aptNumber: args.aptNumber,
						city: args.city,
						state: args.state,
						zipCode: args.zipCode,
						homePhone: args.homePhone,
						cellPhone: args.cellPhone,
						socialSecurityNumber: args.socialSecurityNumber,
						positionApplyingFor: args.positionApplyingFor,
						dateAvailable: args.dateAvailable,
						scheduleRestrictions: args.scheduleRestrictions,
						scheduleExplain: args.scheduleExplain,
						convicted: args.convicted,
						convictedExplain: args.convictedExplain,
						comment: args.comment
					});
				}
			}
		};
	}
});
const Schema = new GraphQLSchema({
	query: Query,
	mutation: Mutation
});

export default Schema;
