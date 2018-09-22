import {
	GraphQLObjectType,
	GraphQLInt,
	GraphQLString,
	GraphQLList,
	GraphQLNonNull,
	GraphQLBoolean,
	GraphQLInputObjectType
} from 'graphql';
import GraphQLDate from 'graphql-date';

import Db from '../models/models';

const fields = {
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
const inputApplication = new GraphQLInputObjectType({
	name: 'inputApplication',
	description: 'Inputs for Application Mutation',

	fields: {
		...fields
	}
});

const type = new GraphQLObjectType({
	name: 'Applications',
	description: 'This is for application form',
	fields: {
		id: {
			type: new GraphQLNonNull(GraphQLInt),
			description: 'Applicant Id'
		},
		...fields
	}
});

const ApplicationQuery = {
	applications: {
		type: new GraphQLList(type),
		description: 'List applications records',
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

const ApplicationMutation = {
	addApplication: {
		type: type,
		description: 'Add application record to database',
		args: {
			application: { type: inputApplication }
		},
		resolve(source, args) {
			return Db.models.Applications.create({
				firstName: args.application.firstName,
				middleName: args.application.middleName,
				lastName: args.application.lastName,
				date: args.application.date,
				streetAddress: args.application.streetAddress,
				aptNumber: args.application.aptNumber,
				city: args.application.city,
				state: args.application.state,
				zipCode: args.application.zipCode,
				homePhone: args.application.homePhone,
				cellPhone: args.application.cellPhone,
				socialSecurityNumber: args.application.socialSecurityNumber,
				positionApplyingFor: args.application.positionApplyingFor,
				dateAvailable: args.application.dateAvailable,
				scheduleRestrictions: args.application.scheduleRestrictions,
				scheduleExplain: args.application.scheduleExplain,
				convicted: args.application.convicted,
				convictedExplain: args.application.convictedExplain,
				comment: args.application.comment
			});
		}
	}
};

export { ApplicationQuery, ApplicationMutation };
