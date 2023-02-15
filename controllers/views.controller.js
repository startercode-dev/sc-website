const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const pug = require('pug');
const Request = require('../models/request.model');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

exports.getAppMain = catchAsync(async (req, res, next) => {
    if (req.user) {
        const user = await User.findById(req.user.id).populate({
            path: '#dataset',
        });

        return res.status(200).render('home', {
            user,
            title: '#main-page-loggedin',
        });
    }

    res.status(200).render('home', {
        title: 'Startercode: Website & Web App Design and Development',
    });
});

exports.getLoginForm = (req, res) => {
    res.status(200).render('login', {
        title: 'startercode | log in',
    });
};

exports.getSignupForm = (req, res) => {
    res.status(200).render('signup', {
        title: 'startercode | sign up',
    });
};

exports.getForgotPasswordForm = (req, res) => {
    res.status(200).render('forgotPassword', {
        title: 'startercode | forgot password',
    });
};

exports.getResetPasswordForm = (req, res) => {
    res.status(200).render('resetPassword', {
        title: 'startercode | reset password',
    });
};

exports.getAccount = (req, res) => {
    res.status(200).render('account', {
        title: 'startercode | my account',
    });
};

exports.formConfirm = (req, res) => {
    res.status(200).render('formConfirm', {
        title: 'check your email',
    });
};

exports.submitRequest = catchAsync(async (req, res, next) => {
    const request = await Request.findOneAndDelete({
        messageRequestToken: req.params.token,
    });

    try {
        if (!request)
            return next(
                new AppError(
                    `Can't find ${req.originalUrl} on this server!`,
                    404
                )
            );

        const template = pug.compileFile(
            `${__dirname}/../views/requestEmail.pug`
        );
        const html = template();

        const { fullName, email, budget, websiteType, message } = request;
        const htmlReplace = html
            .replace('--fullName', fullName)
            .replace('--email', email)
            .replace('--budget', budget)
            .replace('--websiteType', websiteType)
            .replace('--message', message);

        await sendEmail({
            email: 'startercode.dev@gmail.com',
            subject: 'New Customer Inquery',
            html: htmlReplace,
        });

        //* Add confirmed users to the user database
        const newUser = new User({
            name: fullName,
            email: email,
        });
        await newUser.save({ validateBeforeSave: false });

        res.status(200).render('userConfirmed', {
            title: 'thank you!',
        });
    } catch (err) {
        return next(new AppError('email failed to send, try again', 500));
    }
});
