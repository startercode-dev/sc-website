const express = require('express');
const authController = require('../controllers/auth.controller');
const viewController = require('../controllers/views.controller');

const router = express.Router();

router.get('/', authController.isLoggedIn, viewController.getAppMain);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/login', viewController.getLoginForm);
router.get('/signup', viewController.getSignupForm);
router.get('/forgotPassword', viewController.getForgotPasswordForm);
router.get('/resetPassword/:token', viewController.getResetPasswordForm);

//* FORM
router.get('/confirm/request', viewController.formConfirm);
router.get('/submit/request/:token', viewController.submitRequest);

module.exports = router;
