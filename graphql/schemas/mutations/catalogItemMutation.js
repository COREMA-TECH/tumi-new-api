import { inputInsertCatalogItem } from '../types/operations/insertTypes';
import { inputUpdateCatalogItem } from '../types/operations/updateTypes';
import { CatalogItemType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean } from 'graphql';

import Db from '../../models/models';

const CatalogItemMutation = {
	addCatalogItem: {
		type: new GraphQLList(CatalogItemType),
		description: 'Add CatalogItem to database',
		args: {
			catalogitem: { type: new GraphQLList(inputInsertCatalogItem) }
		},
		resolve(source, args) {
			return Db.models.CatalogItem.bulkCreate(args.catalogitem, { returning: true }).then((ret) => {
				return ret.map((data) => {
					return data.dataValues;
				});
			});
		}
	},
	updateCatalogItem: {
		type: CatalogItemType,
		description: 'Update Catalog Item Info',
		args: {
			catalogitem: { type: inputUpdateCatalogItem }
		},
		resolve(source, args) {
			return Db.models.CatalogItem
				.update(
					{
						Id_Catalog: args.catalogitem.Id_Catalog,
						Id_Parent: args.catalogitem.Id_Parent,
						Name: args.catalogitem.Name,
						DisplayLabel: args.catalogitem.DisplayLabel,
						Description: args.catalogitem.Description,
						Value: args.catalogitem.Value,
						// Value01: args.catalogitem.Value01, // TODO: (LF) qUITAR CODIGO COMENTADO
						// Value02: args.catalogitem.Value02,
						// Value03: args.catalogitem.Value03,
						// Value04: args.catalogitem.Value04,
						IsActive: args.catalogitem.IsActive,
						User_Created: args.catalogitem.User_Created,
						User_Updated: args.catalogitem.User_Updated,
						Date_Created: args.catalogitem.Date_Created,
						Date_Updated: args.catalogitem.Date_Updated,
						idEntity: args.catalogitem.idEntity
					},
					{
						where: {
							Id: args.catalogitem.Id
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
	deleteCatalogItem: {
		type: CatalogItemType,
		description: 'Delete Catalog Item record from database',
		args: {
			Id: { type: GraphQLInt }
		},
		resolve(source, args) {
			return Db.models.CatalogItem
				.update(
					{
						IsActive: 0
					},
					{
						where: {
							Id: args.Id
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

export default CatalogItemMutation;
