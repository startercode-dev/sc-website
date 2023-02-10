const express = require('express');
const formController = require('../controllers/form.controller');

const router = express.Router();

router.post('/submit', formController.formSubmit);

module.exports = router;
