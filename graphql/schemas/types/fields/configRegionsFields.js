import { GraphQLInt } from 'graphql';
const configRegionsFields = {
	regionId: {
		type: GraphQLInt
	},
	regionalManagerId: {
		type: GraphQLInt
	},
	regionalDirectorId: {
		type: GraphQLInt
	},
	regionalRecruiterId: {
		type: GraphQLInt
	}
};
export default configRegionsFields;
