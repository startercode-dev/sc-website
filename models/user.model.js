const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name required'],
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'email required'],
            unique: true,
            lowercase: true,
            validate: [validator.isEmail, 'not a valid email'],
            trim: true,
        },

        password: {
            type: String,
            required: [true, 'password required'],
            minlength: 2,
            select: false,
        },

        passwordConfirm: {
            type: String,
            required: [true, 'please confirm password'],
            validate: {
                // ONLY WORKS IN CREATE AND SAVE
                validator: function (el) {
                    return el === this.password;
                },
                msg: 'passwords do not match',
            },
        },

        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        return JWTTimestamp < changedTimestamp;
    }

    // False means NOT changed
    return false;
};

userSchema.methods.correctPassword = async function (
    inputPassword,
    userPassword
) {
    return await bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
