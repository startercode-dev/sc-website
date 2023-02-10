const express = require('express');
const authController = require('../api/controllers/auth-controller');
const adminController = require('../api/controllers/admin-controller');

const router = express.Router();

// ADMIN
router
    .route('/getallusers')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        adminController.getAllUser
    );
// router.route('/:id').get(authController.protect, adminController.getUser);

module.exports = router;
