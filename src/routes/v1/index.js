const express = require('express');
const authRoute = require('./auth.route');
const devicesRoute = require('./devices.route');
const recordRoute = require('./record.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/devices', devicesRoute);
router.use('/record', recordRoute);

module.exports = router;
