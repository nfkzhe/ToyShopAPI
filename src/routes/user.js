const express = require("express");
const userRoute = express.Router();
const UserControllers = require("../controllers/user");
const AuthControllers = require("../controllers/auth");
const { authorizationJwt, adminAuthorization } = require("../middleware");

userRoute.get("/", UserControllers.getAll);
userRoute.delete("/:userId", adminAuthorization, UserControllers.delUser);



userRoute.get("/find/:userID", UserControllers.findUser);
userRoute.post("/login", AuthControllers.login);
userRoute.post("/register", AuthControllers.register);
userRoute.post("/changepass", authorizationJwt, UserControllers.changePass);
userRoute.put("/:userID", authorizationJwt, UserControllers.editProfile);


module.exports = userRoute;
