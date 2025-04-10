const express = require("express");
const categoryRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, adminAuthorization } = require("../middleware");

categoryRoute.get("/", CategoriesControllers.getAllCategories);
categoryRoute.post("/addCate", CategoriesControllers.addCate);
categoryRoute.put("/:CateID", CategoriesControllers.editCate);
categoryRoute.delete("/:CateID", CategoriesControllers.deleteCate);
// categoryRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = categoryRoute;
