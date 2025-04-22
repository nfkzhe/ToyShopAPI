const express = require("express");
const userRoute = require("./user");
const CatgoriesRoute = require("./category");
const apiRoute = express.Router();

const { authorizationJwt } = require("../middleware");
const productRoute = require("./product");
const productsRoute = require("./products");
const cartRoute = require("./cart");
const orderRoute = require("./order");
const adminRoute = require("./admin");
apiRoute.use(
  "/user",
  (req, res, next) => {
    console.log("call user api route");
    next();
  },
  userRoute
);

apiRoute.use(
  "/categories",
  (req, res, next) => {
    console.log("call cate api route");
    next();
  },
  CatgoriesRoute
);
apiRoute.use(
  "/product",
  (req, res, next) => {
    console.log("call product api route");
    next();
  },
  productRoute
);
apiRoute.use(
  "/products",
  (req, res, next) => {
    console.log("call products api route");
    next();
  },
  productsRoute
);
apiRoute.use(
  "/cart",
  (req, res, next) => {
    console.log("call cart api route");
    next();
  },
  cartRoute
);
apiRoute.use(
  "/orders",
  (req, res, next) => {
    console.log("call orders api route");
    next();
  },
  orderRoute
);

apiRoute.use(
  "/admin",
  (req, res, next) => {
    console.log("call Admin api route");
    next();
  },
  adminRoute
);


apiRoute.use("/", function (req, res) {
  return res.json({ message: "api working" });
});

module.exports = apiRoute;
