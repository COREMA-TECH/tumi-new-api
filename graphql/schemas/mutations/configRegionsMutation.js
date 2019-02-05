import { inputInsertConfigRegions } from '../types/operations/insertTypes';
import { inputUpdateConfigRegions } from '../types/operations/updateTypes';
import { ConfigRegionsType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const configRegionsMutation = {
	addConfigRegions: {
		type: new GraphQLList(ConfigRegionsType),
		description: 'Add Employees to database',
		args: {
			configregions: { type: new GraphQLList(inputInsertConfigRegions) }
		},
		resolve(source, args) {
			return Db.models.ConfigRegions.bulkCreate(args.configregions, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},

	updateConfigRegions: {
		type: ConfigRegionsType,
		description: 'Update Config Regions',
		args: {
			regionId: { type: GraphQLInt },
			regionalManagerId: { type: GraphQLInt },
			regionalDirectorId: { type: GraphQLInt }
		},
		resolve(source, args) {
			console.log("updateConfigRegions", args)
			return Db.models.ConfigRegions
				.update(
					{
						regionalManagerId: args.regionalManagerId,
						regionalDirectorId: args.regionalDirectorId
					},
					{
						where: {
							regionId: args.regionId
						},
						returning: true
					}
				)
				.then(function ([rowsUpdate, [record]]) {
					if (record) return record.dataValues;
					else return null;
				});
		}
	},
};

export default configRegionsMutation;
