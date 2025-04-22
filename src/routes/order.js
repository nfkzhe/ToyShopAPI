const express = require('express');
const OrderRouter = express.Router();
const orderController = require('../controllers/order');
const { authorizationJwt, isAdmin } = require("../middleware");


OrderRouter.post('/', orderController.createOrder);
OrderRouter.get('/user/', authorizationJwt, orderController.getUserOrders);
OrderRouter.get('/:id', orderController.getOrderById);
OrderRouter.get('/', authorizationJwt, isAdmin, orderController.getAllOrders);
module.exports = OrderRouter;