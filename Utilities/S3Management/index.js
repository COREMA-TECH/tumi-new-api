import AWS from 'aws-sdk';
import fs from 'fs';
const path = require('path');

/**
 * Upload to S3
 * @param {string} filePath 
 * @returns {Promise<string>} Promise - urlFile
 */
export const uploadToS3 = (filePath) => {
   return new Promise((resolve, reject) => {
      try {
         var s3 = new AWS.S3({
            accessKeyId: 'AKIAZTTPXWUZ6OPRW2P6',
            secretAccessKey: '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',
            region: 'us-east-1'
         });
         
         // return
         var params = {
            Bucket: 'orion1-files',
            Body : fs.createReadStream(filePath),
            ACL: 'public-read',
            Key : 'documents/' + path.parse(filePath).base
         };

         s3.upload(params, function (err, data) {
            //handle error
            if (err) {
               console.log("Error", err);
               resolve(null);
            }
            //success
            if (data) {
               resolve(data.Location);
            }
         });
      } catch (error) {
          console.log(error);
          resolve(null);
      }
   });
}