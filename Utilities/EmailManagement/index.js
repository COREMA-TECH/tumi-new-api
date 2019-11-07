import axios from 'axios';
const tokenEmailApi = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VyIjoiNlA0MTc2MjU0ciIsImVtYWlsIjoiam9yZ2UuY29yZWFAc21ic3NvbHV0aW9ucy5jb20ifSwiaWF0IjoxNTY2MjI4MzcxfQ.QpeaM8dKTbJ22OLYJGu9vjrFG3yBfWDXYGxiuZO6TJk';
const urlEmailApiOnline = 'http://smbs-mails.us-east-2.elasticbeanstalk.com/api/emails/customEmail';
const urlEmailApiLocal = 'http://localhost:3001/api/emails/customEmail';

/**
 * Email Sending
 * @param {Object} data {from, to, subject, message}
 * @param {String} data.from source email
 * @param {String} data.to target email
 * @param {string} data.subject subject
 * @param {string} data.message body message
 * @returns {String} Message Confirm
 */
export const sendEmailApi = data => {
    return new Promise((resolve, reject) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: tokenEmailApi
                }
            };
            
            axios.post(urlEmailApiOnline, data, config)
                .then(function (response) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    })
}