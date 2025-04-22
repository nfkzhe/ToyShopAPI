const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { authorizationJwt, isAdmin } = require('../middleware/');

router.get('/overview', authorizationJwt, isAdmin, dashboardController.getOverviewStats);
router.get('/revenue-chart', authorizationJwt, isAdmin, dashboardController.getRevenueChart);
router.get('/category-distribution', authorizationJwt, isAdmin, dashboardController.getCategoryDistribution);
router.get('/top-products', authorizationJwt, isAdmin, dashboardController.getTopProducts);
router.get('/recent-orders', authorizationJwt, isAdmin, dashboardController.getRecentOrders);

module.exports = router;