const express = require("express");
const productsRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, adminAuthorization } = require("../middleware");

//LAY ALL KO PHAN TRANG
productsRoute.get("/", CategoriesControllers.getAllProduct)
// LAY BAN CHAY
productsRoute.get("/topsell", CategoriesControllers.getTopSoldProduct);
// LAY NOI BAT
productsRoute.get("/featured", CategoriesControllers.getFeaturedProducts);
// LAY GIAM GIA
productsRoute.get("/discounted", CategoriesControllers.getDiscountedProducts);
// LAY CHI TIET 1 SAN PHAM
productsRoute.get("/detail/:ProductID", CategoriesControllers.getProductDetail);
// productRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = productsRoute;
