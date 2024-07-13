const { SMTPServer } = require('smtp-server');
const { simpleParser } = require('mailparser');
const fs = require('fs');

const server = new SMTPServer({
    secure: true,
    key: fs.readFileSync('path/to/your/private-key.pem'),  // SSL private key
    cert: fs.readFileSync('path/to/your/certificate.pem'), // SSL certificate
    authOptional: false,
    onAuth(auth, session, callback) {
        // Replace this with your authentication logic
        if (auth.username === 'user' && auth.password === 'password') {
            return callback(null, { user: 'user' });
        } else {
            return callback(new Error('Invalid username or password'));
        }
    },
    onData(stream, session, callback) {
        simpleParser(stream)
            .then(parsed => {
                console.log('Subject:', parsed.subject);
                console.log('From:', parsed.from.text);
                console.log('To:', parsed.to.text);
                console.log('Text body:', parsed.text);
                // Process email (e.g., save to database, forward, etc.)
                // Process attachments
                if (parsed.attachments.length > 0) {
                    parsed.attachments.forEach(attachment => {
                        const filePath = path.join(__dirname, 'attachments', attachment.filename);
                        fs.writeFile(filePath, attachment.content, (err) => {
                            if (err) {
                                console.error('Error saving attachment:', err);
                            } else {
                                console.log('Attachment saved to:', filePath);
                            }
                        });
                    });
                }
            })
            .catch(err => {
                console.error('Error parsing email:', err);
            });
        stream.on('end', callback);
    }
});

server.listen(465, () => {
    console.log('SMTP server is listening on port 465');
});
