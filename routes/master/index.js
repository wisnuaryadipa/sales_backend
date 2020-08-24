const express = require('express');
const router = express.Router();
const customer = require('./customer');


// This page is routing page for master data

router.use('/customer', customer);

module.exports = router