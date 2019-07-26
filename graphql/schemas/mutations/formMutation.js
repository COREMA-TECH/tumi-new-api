import { inputInsertFormType } from '../types/operations/insertTypes';
import { inputUpdateFormType } from '../types/operations/updateTypes';
import { FormsType } from '../types/operations/outputTypes';
import { GraphQLList } from 'graphql';

import Db from '../../models/models';

const FormMutation = {
    addForm: {
        type: new GraphQLList(FormsType),
        description: 'Add Form Record to database',
        args: {
            forms: { type: new GraphQLList(inputInsertFormType) }
        },
        resolve(source, args) {
            return Db.models.Forms.bulkCreate(args.forms, { returning: true }).then((output) => {
                return output.map((element) => {
                    return element.dataValues;
                });
            });
        }
    },
    updateForm: {
        type: FormsType,
        description: 'Update Form Record',
        args: {
            form: { type: inputUpdateFormType }
        },
        resolve(source, args) {

            return Db.models.Forms
                .update(
                    args.form
                    ,
                    {
                        where: {
                            Id: args.form.Id
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

export default FormMutation;
