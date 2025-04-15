const express = require("express");
const userRoute = require("./user");
const CatgoriesRoute = require("./category");
const apiRoute = express.Router();

const { authorizationJwt } = require("../middleware");
const productRoute = require("./product");
const productsRoute = require("./products");
const cartRoute = require("./cart");

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
// apiRoute.use('/admin',(req, res, next) => {
//     console.log('call admin api route');
//     next();
// }, courseRoute);

apiRoute.use("/", function (req, res) {
  return res.json({ message: "api working" });
});

module.exports = apiRoute;
