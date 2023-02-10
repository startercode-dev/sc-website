const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const User = require('../models/user.model');

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role,
    });

    createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('no email or password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('email or password is wrong', 401));
    }

    createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res, next) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError('no user found', 404));
    }

    // generate reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // send email
    const resetUrl = `<a href="${req.protocol}://${req.get(
        'host'
    )}/resetPassword/${resetToken}">reset password</a>`;
    const html = `Click the link to reset password: ${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset',
            html,
        });

        res.status(200).json({
            status: 'success',
            msg: 'Email sent',
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('email failed to send, try again', 500));
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    // get user
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new AppError('token expired or invalid', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).json({
        status: 'success',
        msg: 'password reset successful',
    });
});

const jwtSignToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

const createSendToken = (user, statusCode, req, res) => {
    const token = jwtSignToken(user._id);

    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    });

    // remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    // Check if token exist
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(new AppError('not logged in', 401));
    }

    // Verify Token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // Check if user exist
    const currUser = await User.findById(decoded.id);
    if (!currUser) {
        return next(new AppError('user not found', 401));
    }

    // Check if user changed password after token was issued
    if (currUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401
            )
        );
    }

    req.user = currUser;
    res.locals.user = currUser;
    next();
});

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            // 2) Check if user still exists
            const currUser = await User.findById(decoded.id);
            if (!currUser) {
                return next();
            }

            // 3) Check if user changed password after the token was issued
            if (currUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }

            // THERE IS A LOGGED IN USER
            req.user = currUser;
            res.locals.user = currUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

// Restrict role filter
exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('no permission', 403));
        }
        next();
    };
