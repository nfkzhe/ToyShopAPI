const express = require("express");
const cartRoute = express.Router();
const cartController = require("../controllers/cart");
const { authorizationJwt } = require("../middleware");

cartRoute.get("/", authorizationJwt, cartController.getCart);
cartRoute.post("/", authorizationJwt, cartController.addCart);

module.exports = cartRoute;
