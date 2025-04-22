const express = require("express");
const userRoute = express.Router();

const UserControllers = require("../controllers/user");
const AuthControllers = require("../controllers/auth");

const { authorizationJwt, isAdmin } = require("../middleware/index");

const upload = require("../middleware/upload");

userRoute.get("/", authorizationJwt, isAdmin, UserControllers.getAll);
userRoute.get("/profile", authorizationJwt, UserControllers.getProfile);
userRoute.get("/find", authorizationJwt,  UserControllers.findUser);
userRoute.post("/upload-avatar", authorizationJwt, upload.uploadAvatar, UserControllers.uploadAvatar)
userRoute.post("/login", AuthControllers.login);
userRoute.post('/logout', AuthControllers.logout);
userRoute.post("/register", AuthControllers.register);
userRoute.post("/changepass", authorizationJwt, UserControllers.changePass);
userRoute.put("/:userID", authorizationJwt, UserControllers.editProfile);
userRoute.delete("/:userId", authorizationJwt,isAdmin, UserControllers.delUser);

module.exports = userRoute;
