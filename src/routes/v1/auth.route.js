const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();

const authController = require('../../controllers/auth.controller');

router.post('/register',authController.register);
router.post('/login', authController.login);
router.post('/token', authController.token);

module.exports = router;