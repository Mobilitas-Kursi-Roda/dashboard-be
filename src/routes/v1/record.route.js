const express = require('express');
const middleware = require('../../middleware/auth');
const router = express.Router();

const recordController = require('../../controllers/record.controller');

router.get('/get', middleware.auth, recordController.getAll);
router.post('/session', middleware.auth, recordController.postSession);
router.get('/session/:device_id', middleware.auth, recordController.getLastSession);
router.post('/save', middleware.auth, recordController.save);


module.exports = router;