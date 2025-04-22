const express = require("express");
const categoryRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, isAdmin } = require("../middleware");

categoryRoute.get("/", CategoriesControllers.getAllCategories);
categoryRoute.post("/addCate", authorizationJwt, isAdmin, CategoriesControllers.addCate);
categoryRoute.put("/:CateID", authorizationJwt, isAdmin, CategoriesControllers.editCate);
categoryRoute.delete("/:CateID", authorizationJwt, isAdmin, CategoriesControllers.deleteCate);
// categoryRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = categoryRoute;
