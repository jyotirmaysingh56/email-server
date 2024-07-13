const nodemailer = require('nodemailer');
const fs = require('fs');

async function sendEmail() {
    let transporter = nodemailer.createTransport({
        host: 'localhost',
        port: 465,
        secure: true,
        auth: {
            user: 'user',
            pass: 'password'
        },
        dkim: {
            domainName: 'example.com',
            keySelector: 'default',
            privateKey: fs.readFileSync('path/to/dkim-private.pem', 'utf8')
        }
    });

    let info = await transporter.sendMail({
        from: '"Sender" <sender@example.com>',
        to: 'recipient@example.com',
        subject: 'Hello',
        text: 'Hello world!',
        html: '<b>Hello world!</b>',
        attachments: [
            {
                filename: 'test.txt',
                content: 'Hello world in a text file'
            }
        ]
    });

    console.log('Message sent:', info.messageId);
}

sendEmail().catch(console.error);
