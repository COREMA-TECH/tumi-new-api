

export const summary = (data) => {
    return `<div class="WordSection1">
    <table style="border-collapse: collapse; width: 100%; height: 75px;" border='0'>

    <tbody style='border-bottom: solid 3px #b40639;'>
    
    <tr style='height: 91px;'>
    
    <td style='width: 8.21675%; height: 75px;'><img src='
     data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMqaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MiA3OS4xNjA5MjQsIDIwMTcvMDcvMTMtMDE6MDY6MzkgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUQxREFFMTI5ODlDMTFFOTk5RThBMUI2MzJERjEyMTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUQxREFFMTM5ODlDMTFFOTk5RThBMUI2MzJERjEyMTYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo1RDFEQUUxMDk4OUMxMUU5OTlFOEExQjYzMkRGMTIxNiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo1RDFEQUUxMTk4OUMxMUU5OTlFOEExQjYzMkRGMTIxNiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv/uAA5BZG9iZQBkwAAAAAH/2wCEAAYEBAQFBAYFBQYJBgUGCQsIBgYI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
    ' style='margin-bottom: 0px;'/></td>
    
    <td style='width: 91.7833%; height: 75px;' valign="bottom" align="right">
    
    <p><strong><span style="font-family: 'times new roman', times; color: #b40639; font-size:24px">SUMMARY</span></strong> <br/>
    <span style="font-family: 'times new roman', times; font-size:24px"><span style='color: #b40639;'><strong>NAME</strong>: </span> ${data.applicantName || '--'} </span></p>
    
    </td>
    
    </tr>
    
    </tbody>
    
    </table>
    
    <h4><strong><span style="font-family: 'times new roman', times; color: #b40639;">PERSONAL INFORMATION:</span></span></strong></h4>
    
    <table style='border-collapse: collapse; width: 100%; height: 42px;' border='0'>
    
    <tbody>
    
    <tr style='height: 21px;'>
    
    <td style='width: 50%; height: 21px;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #000000;'><strong>SOCIAL SECURITY NO:</strong> </span> ${data.socialSecurityNumber || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #000000;'><strong>CONTACT</strong>:</span> ${data.cellphone || '--'} </span></p>
    
    </td>
    
    <td style='width: 50%; height: 21px;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #000000;'><strong>GENDER:</strong></span> ${data.gender || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #000000;'><strong>BIRTHDATE:</strong></span> ${data.birthDay || '--'} </span></p>
    
    </td>
    
    </tr>
    
    </tbody>
    
    </table>
    <br/>
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>ADDRESS:</strong></span> ${data.address || '--'} </span></p>
    <br/>
    <table style='border-collapse: collapse; width: 100%; background-color: #ecf0f1; border-color: #ffffff;' border='0'>
    
    <tbody>
    
    <tr>
    
    <td style='width: 50%;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>HOTEL:</strong></span> ${data.hotel || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>DEPARTMENT:</strong></span> -- </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>JOB DESCRIPTION:</strong></span> -- </span></p>
    
    </td>
    
    <td style='width: 50%;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>HIRE DATE:</strong></span> ${data.hireDate || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><strong><span style='color: #b40639;'>EMPLOYMENT TYPE(FT/PT):</span></strong> ${data.employmentType || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><strong><span style='color: #b40639;'>PAY RATE:</span></strong>  -- </span></p>
    
    </td>
    
    </tr>
    
    </tbody>
    
    </table>
    <br/>
    <br/>
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>STATUS (SINGLE/MARRIED):</strong></span> ${data.marital || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>NO. OF DEPENDENT:</strong></span> ${data.exemptions || '--'}</span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>SOURCE:</strong></span> ${data.source || '--'} </span></p>
    
    <br/>
    <br/>
    <table style='border-collapse: collapse; width: 100%; background-color: #ecf0f1;' border='0'>
    
    <tbody>
    
    <tr>
    
    <td style='width: 100%;>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>DIRECT DEPOSIT ACCOUNT NO:</strong></span> ${data.accountNumber || '--' } </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>BANK NAME:</strong></span> ${data.bankName || '--' } </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>ROUTING NO:</strong></span> ${data.routingNumber || '--' } </span></p>
    
    </td>
    
    </tr>
    
    </tbody>
    
    </table>
    <br/>
    <br/>
    <table style='border-collapse: collapse; width: 100%;' border='0'>
    
    <tbody>
    
    <tr>
    
    <td style='width: 50%;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>ID:</strong></span> ${data.numberId || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><strong><span style='color: #b40639;'>TYPE OF ID:</span></strong> ${data.typeOfId || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>EXP DATE:</strong></span> ${data.expireDateId || '--'} </span></p>
    
    </td>
    
    <td style='width: 50%;'>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>CAR:</strong></span> ${data.car || '--'} </span></p>
    
    <p><span style="font-family: 'times new roman', times;"><span style='color: #b40639;'><strong>AREA:</strong></span> ${data.area || '--'} </span></p>
    
    </td>
    
    </tr>
    
    </tbody>
    
    </table>
    
    <p>&nbsp;</p>`;
}