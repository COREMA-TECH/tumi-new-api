import { ApplicantIndepenentContractType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLBoolean, GraphQLString } from 'graphql';
import pdf from 'html-pdf';
import AWS from 'aws-sdk';
import fs from 'fs';

import Db from '../../models/models';

const ApplicantIndependentContractMutation = {
    addApplicantIndependentContract: {
        type: ApplicantIndepenentContractType,
        description: 'Add Independent Contract to database',
        args: {
            html: { type: GraphQLString },
            ApplicationId: { type: GraphQLInt }
        },
        resolve(source, args) {

            var filename = `independentContract_${args.ApplicationId}`;
            var srcFile = `./public/${filename}.pdf`;

            return Db.models.ApplicantIndependentContract.create({ fileName: filename, url: srcFile, fileExtension: ".pdf", completed: true, ApplicationId: args.ApplicationId, html: args.html });
        }
    },
};

export default ApplicantIndependentContractMutation;
