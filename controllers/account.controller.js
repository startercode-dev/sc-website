const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/user.model');

exports.updateMe = catchAsync(async (req, res, next) => {
    // create error for password change
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError('not for password updates, use /updateMyPassword', 400)
        );
    }

    // filter unwanted fields
    const filteredBody = filterObj(req.body, 'name', 'email');

    // update user
    const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updateUser,
        },
    });
});

exports.updateMyPassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    // check current password
    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(new AppError('current password is wrong', 401));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    createSendToken(user, 200, req, res);
});

// HELPER FUNCTIONS
const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};
