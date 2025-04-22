const express = require("express");
const productRoute = express.Router();
const CategoriesControllers = require("../controllers/category");
const { authorizationJwt, isAdmin } = require("../middleware");
const upload = require("../middleware/upload");

//UpdateSanPham
productRoute.put("/:id", authorizationJwt, isAdmin, CategoriesControllers.updateProduct);
//Them SanPham
productRoute.post("/addProduct", authorizationJwt, isAdmin, CategoriesControllers.addProduct);
//UpAnh SanPham
productRoute.post('/upload/product-images', authorizationJwt, isAdmin, upload.uploadProductImages, CategoriesControllers.uploadProductImages);
//DEL
productRoute.delete('/:id', authorizationJwt, isAdmin, CategoriesControllers.deleteProduct)
//Lấy SP THEO DANHMUC
productRoute.get("/getByCate", CategoriesControllers.getProductByCategory);
//LẤY ALL SANPHAM PHAN TRANG
productRoute.get("/", CategoriesControllers.getAll);

// productRoute.post("/addcart", authorizationJwt, CategoriesControllers.addcart);


module.exports = productRoute;
