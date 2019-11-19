const ftp = require("basic-ftp");

/**
 * upload file to FTP
 * @param {string} localPath file path
 * @param {string} remotePath file remote path
 * @returns {Promise<string>} Promise - Success Message
 */
export const uploadbyFTP = (localPath, remotePath) => {
    return new Promise(async (resolve, reject) => {
        const client = new ftp.Client();
        let response = null;
        client.ftp.verbose = true;
        try {
            await client.access({
                host: "smbssolutions.com",
                user: "ftpuser@smbssolutions.com",
                password: "ftp2019*"
            });
            await client.uploadFrom(localPath, remotePath).then(result => console.log('resultado de subida por FTP ::', result));
            response = 'Success';
        }
        catch(err) {
            console.log(err);
        }
        client.close();
        
        resolve(response);
    });
}