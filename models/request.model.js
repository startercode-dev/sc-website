const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const requestSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'A request must have a full name'],
    },
    email: {
        type: String,
        required: [true, 'A request must have an email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    budget: {
        type: String,
        required: [true, 'A request must have a budget'],
    },
    websiteType: {
        type: String,
        required: [true, 'A request must have a website type'],
    },
    message: {
        type: String,
        required: [true, 'A request must have a message'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    messageRequestToken: String,
});

requestSchema.index({ createdAt: 1 }, { expires: '7d' });

requestSchema.methods.createRequestToken = function () {
    const requestToken = crypto.randomBytes(32).toString('hex');

    this.messageRequestToken = requestToken;

    return requestToken;
};

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
