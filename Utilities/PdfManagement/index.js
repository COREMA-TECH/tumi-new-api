import pdf from 'html-pdf';

const pdfFilesPathDefault = './public/Documents/';

/**
 * HTML to PDF generator (default path: './public/Documents/' )
 * @param {string} html html code
 * @param {string} fileName File name with extension
 * @param {string} [filePath="./public/Documents/"] Only if you want to change the default path
 * @returns {Promise<string>} Promise - file fullPath
 */
export const generatePdfFile = (html, fileName, filePath = pdfFilesPathDefault) => {
    return new Promise((resolve, reject) => {
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
       pdf.create(html, options).toFile(filePath + fileName, function (err, {filename}) {
          if (err) {
              console.log(err);
              resolve(null);
          }
          else resolve(filePath + fileName); // 
       });
    });
 }