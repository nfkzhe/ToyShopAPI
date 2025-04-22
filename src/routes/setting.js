const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/appSetting')

router.get("/", settingsController.getSettings)

module.exports = router;