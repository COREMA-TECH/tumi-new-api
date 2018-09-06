//Requerimos el paquete
var nodemailer = require('nodemailer');
var pdf = require('html-pdf');

var transporter = nodemailer.createTransport({
    service: 'Hotmail',
    auth: {
        user: 'coremagroup@hotmail.com',
        pass: 'Corema123'
    }
});;

var mailOptions = {
    from: 'coremagroup@hotmail.com',
    to: 'mppomar@gmail.com',
    subject: 'Contracto',
    //text: 'Tumi welcomes and we thank you for trusting us.',
    //html: '<b>Tumi welcomes and we thank you for trusting us.</b></br> <b>We just need you to sign your contract, for that click on the following link</b></br>'
    // HTML body
    html:
        '<p>Tumi welcomes and we thank you for trusting us.</p>' +
        '<p>We have attached your contract, if you need more information you can contact us.</p>',
    attachments: [
        // String attachment
        {
            filename: 'Contract.pdf',
            content: 'Some notes about this e-mail',
            path: './Contract.pdf',
            // contentType: 'application/pdf'
            contentType: 'text/plain' // optional, would be detected from the filename
        },
    ]
};

var contenido = '<p>Tumi welcomes and we thank you for trusting us.</p>'

pdf.create(contenido).toFile('./Contract.pdf', function (err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log(res);
    }
});


transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email enviado: ' + info.response);
    }
});