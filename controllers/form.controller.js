const Request = require('../models/request.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const pug = require('pug');
// const confirmationEmail = require('../views/confirmationEmail.pug');

exports.formSubmit = catchAsync(async (req, res, next) => {
    // 1) Create new response in database
    const newRequest = await Request.create(req.body);

    // 2) Generate and save response token
    const requestToken = newRequest.createRequestToken();
    await newRequest.save({ validateBeforeSave: false });

    // 3) Email request thru: API endpoint
    const requestSendUrl = `${req.protocol}://${req.get(
        'host'
    )}/submit/request/${requestToken}`;

    try {
        const template = pug.compileFile(
            `${__dirname}/../views/confirmationEmail.pug`
        );
        const html = template();
        const htmlReplaced = html.replace('{{ sendRequest }}', requestSendUrl);

        await sendEmail({
            email: req.body.email,
            subject: 'startercode Confirmation Email',
            html: htmlReplaced,
        });

        res.status(200).json({
            status: 'success',
            msg: 'Email sent',
        });
    } catch (err) {
        return next(new AppError('email failed to send, try again', 500));
    }
});
