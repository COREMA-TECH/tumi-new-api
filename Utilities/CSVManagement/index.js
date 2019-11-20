import fs from 'fs';
import os from 'os';

const defaultPath = './public/Documents/';

/**
 * CSV Generator (default path: './public/Documents/' )
 * @param {string} filename Full filename
 * @param {Object.<string, string>[]} data Array of objects
 * @param {string} path Only if you want to change the default path "./public/Documents/"
 * @returns {Promise<string>} Promise - file fullPath
 */
export const generateCSVFile = (filename, data, path = defaultPath) => {
    return new Promise((resolve, reject) => {
        try {
            const rows = data.map(row => {
                return Object.keys(row).map(col => {
                    return row[col];
                }).join(',');
            });

            fs.writeFile(path + filename, rows.join(os.EOL), (err) => {
                if(err) {
                    console.log(err);
                    resolve(null);
                }
                else resolve(path + filename);
            });
        }
        catch(error) {
            console.log('Error: generateCSVFile -> ', error);
            resolve(null);
        }
    });    
}