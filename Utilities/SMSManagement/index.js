import axios from 'axios';
const tokenSmsApi = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJ1c2VyIjoiNlA0MTc2MjU0ciIsImVtYWlsIjoiam9yZ2UuY29yZWFAc21ic3NvbHV0aW9ucy5jb20ifSwiaWF0IjoxNTY2MjI4MzcxfQ.QpeaM8dKTbJ22OLYJGu9vjrFG3yBfWDXYGxiuZO6TJk';
const urlSmsApiOnline = 'http://smbs-mails.us-east-2.elasticbeanstalk.com/api/sms';
const urlSmsApiLocal = 'http://localhost:3001/api/sms';

/**
 * SMS Sending
 * @param {Object} data {msg, number}
 * @param {String} data.msg Message
 * @param {String} data.number Phone Number
 * @returns {String} Message Confirm
 */
export const sendSMSApi = data => {
    const {msg, number} = data;
    return new Promise((resolve, reject) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: tokenSmsApi
                }
            };
    
            axios.post(urlSmsApiOnline, { phoneNumber: number, message: msg }, config)
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