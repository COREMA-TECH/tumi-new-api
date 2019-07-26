import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { FormsType } from '../types/operations/outputTypes';
import Db from '../../models/models';

const getFormFilters = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop] !== null)
            //Exclude IdRoles from filters
            if (!["IdRoles"].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
    }
    return newFilter;
}

const getRolesFormFilter = (filter) => {
    var newFilter = {};

    //Validate if filter object exists
    if (!filter)
        return newFilter;

    //Loop trough eacth filter
    for (var prop in filter) {
        //Validate if the filter has value
        if (filter[prop] !== null)
            //Exclude IdRoles from filters
            if (["IdRoles"].join().includes(prop))
                newFilter = { ...newFilter, [prop]: filter[prop] };
    }
    return newFilter;
}

const FormsQuery = {
    forms: {
        type: new GraphQLList(FormsType),
        description: 'List of Forms',
        args: {
            Id: {
                type: GraphQLInt
            },
            IsActive: {
                type: GraphQLInt
            },
            ParentId: {
                type: GraphQLInt
            },
            show: {
                type: GraphQLBoolean
            }

        },
        resolve(root, args) {
            return Db.models.Forms.findAll({ where: args, order: [['sort', 'ASC']] });
        }
    },
    activeFormsByRole: {
        type: new GraphQLList(FormsType),
        description: 'List of Forms',
        args: {
            Id: {
                type: GraphQLInt
            },
            ParentId: {
                type: GraphQLInt
            },
            show: {
                type: GraphQLBoolean
            },
            IdRoles: {
                type: GraphQLInt
            }

        },
        resolve(root, args) {
            return Db.models.Forms.findAll(
                {
                    where: { ...getFormFilters(args), IsActive: 1 },
                    order: [['sort', 'ASC']],
                    include: [{
                        model: Db.models.RolesForms,
                        where: { ...getRolesFormFilter(args), IsActive: 1 },
                        include: [{
                            model: Db.models.Roles,
                            where: { IsActive: 1 },
                            as: 'Roles'
                        }]
                    }]
                });
        }
    }
};

export default FormsQuery;
