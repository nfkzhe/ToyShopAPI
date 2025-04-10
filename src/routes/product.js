const express = require("express");
const productRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, adminAuthorization } = require("../middleware");


productRoute.get("/", CategoriesControllers.getAll);
productRoute.get("/getByCate", CategoriesControllers.getProductByCategory);
productRoute.get("/:ProductID", CategoriesControllers.getProductDetail);
productRoute.post("/addProduct", CategoriesControllers.addProduct);

// productRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = productRoute;
