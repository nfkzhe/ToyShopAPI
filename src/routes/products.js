const express = require("express");
const productsRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, adminAuthorization } = require("../middleware");

productsRoute.get("/topsell", CategoriesControllers.getTopSoldProduct);
productsRoute.get("/detail/:ProductID", CategoriesControllers.getProductDetail);
// productRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = productsRoute;
