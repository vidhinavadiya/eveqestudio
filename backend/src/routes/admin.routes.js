const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/adminDashboard.controller');
const authMiddleware = require('../middlewares/auth.middleware');


router.get('/dashboard', authMiddleware(['admin']), dashboardController.getDashboard);

module.exports = router;