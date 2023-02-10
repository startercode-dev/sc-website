const sendgrid = require('@sendgrid/mail');

const sendEmail = async (options) => {
    try {
        sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: options.email,
            from: 'no-reply@startercode.dev',
            subject: options.subject,
            html: options.html,
        };

        await sendgrid.send(msg);
    } catch (err) {
        console.error(err);
    }
};

module.exports = sendEmail;
