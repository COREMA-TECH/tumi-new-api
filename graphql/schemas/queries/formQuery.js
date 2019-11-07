import { GraphQLInt, GraphQLList, GraphQLBoolean } from 'graphql';
import { FormsType, NewFormsType } from '../types/operations/outputTypes';
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

const groupByKey = (key, array) => {
    return array.reduce((grouped, curr) => {
        const value = curr.dataValues[key];
        grouped[value] = (grouped[value] || []).concat(curr.dataValues);
        return grouped;
    }, {});
}


const _forms = {
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
}

const FormsQuery = {
    forms: _forms,
    getforms: _forms,
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
    },

    getParentItems: {
        type: new GraphQLList(NewFormsType),
        description: "Find parent nodes for the form roles table",
        args: {},
        async resolve(root, args){
            const parentNodes = await Db.models.Forms.findAll({
                where: { ParentId: 0 }
            });

            return parentNodes;
        }
    },

    getFormRolesList: {
        type: new GraphQLList(FormsType),
        description: "Data for the permission assignment screen",
        args: {
            IdRoles: {
                type: GraphQLInt
            }
        },
        async resolve(root, args) {
            const forms = await Db.models.Forms.findAll({
                where: { show: true, IsActive: 1 },
                order: [['sort', 'ASC']],
                include: [{
                    model: Db.models.RolesForms,                       
                    include: [{
                        model: Db.models.Roles,
                        where: { IsActive: 1 },
                        as: 'Roles'
                    }]
                }]
            });

            const formRoles = await Db.models.RolesForms.findAll({
                where: { IdRoles: args.IdRoles }
            });            

            return forms;
        }
    }
};

export default FormsQuery;
