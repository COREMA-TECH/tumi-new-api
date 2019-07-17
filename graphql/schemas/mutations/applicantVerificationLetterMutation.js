import { inputInsertApplicantW4 } from '../types/operations/insertTypes';
import { ApplicantVerificationLetterType } from '../types/operations/outputTypes';
import { GraphQLList, GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import pdf from 'html-pdf';
import { Transporter } from '../../../Configuration/Configuration';
import Db from '../../models/models';

const uuidv4 = require('uuid/v4');
const fs = require('fs');

const ApplicantVerificationLetterMutation = {
    addApplicantVerificationLetter: {
        type: GraphQLString,
        description: 'Add Applicant Verification Letter to database',
        args: {
            html: { type: new GraphQLNonNull(GraphQLString) },
            ApplicationId: { type: new GraphQLNonNull(GraphQLInt) },
            email: { type: new GraphQLNonNull(GraphQLString) }
        },
        resolve(source, args) {

            //aqui va la logica del PDF
            var options = {
                format: 'Letter',
                font: 'Arial',
                size: 12,
                type: "pdf",             // allowed file types: png, jpeg, pdf
                quality: "75",           // only used for types png & jpeg
                orientation: 'portrait',
                zoomFactor: 1,
                border: {
                    top: '0.98in', // default is 0, units: mm, cm, in, px
                    right: '0.98in',
                    bottom: '0.98in',
                    left: '0.98in'
                }
            };
            var filename = `ApplicantVerificationLetter_${args.ApplicationId}_${uuidv4()}`;
            var srcFile = `./public/Documents/${filename}.pdf`;


            return Db.models.ApplicantVerificationLetter.create({ ApplicationId: args.ApplicationId, html: args.html, fileName: filename })
                .then((output) => {
                    //Craete PDF
                    pdf.create(args.html, options).toFile(srcFile, (err, res) => {
                        if (err) return console.log(err);
                        //Sen Email
                        let mailOptions = {
                            from: '"Tumi Staffing" <tumistaffing@hotmail.com>', // sender address
                            to: args.email, // list of receivers
                            subject: "Employment Verification Letter", // Subject line
                            attachments: [{
                                filename,
                                path: res.filename,
                                contentType: 'application/pdf'
                            }],
                        }
                        //	send mail with defined transport object
                        Transporter.sendMail(mailOptions).then((ret) => {
                            console.log(`Message status ${ret.response}`)
                        }).catch(error => {
                            console.log(error);
                        })
                    })

                    let notExists = true;
                    //Verify when PDF has been created
                    while (notExists) {
                        try {
                            fs.accessSync(srcFile, fs.W_OK);
                            notExists = false;

                        } catch (e) {
                            console.log("Sigue escribiendo");
                        }
                    }
                    return srcFile;
                });
        }
    },
};

export default ApplicantVerificationLetterMutation;
