const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();

const deviceController = require('../../controllers/devices.controller');

router.get('/get', middleware.auth, deviceController.getAll);

module.exports = router;