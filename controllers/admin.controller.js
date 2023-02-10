const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ADMIN
exports.getAllUser = catchAsync(async (req, res, next) => {
    const data = await User.find();

    res.status(200).json({
        status: 'success',
        results: data.length,
        data,
    });
});
