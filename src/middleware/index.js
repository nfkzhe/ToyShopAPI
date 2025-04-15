const jwt = require("jsonwebtoken");

const authorizationJwt = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);
  
  jwt.verify(token, process.env.SECRET_KEY , (err, user) => {
    console.log(err);
    if (err) {
      console.log("Forbidden login")
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const adminAuthorization = (req, res, next) => {
  authorizationJwt(req, res, () => {
    if (req.user.UserData.admin) {
      console.log(req.user.UserData);
      next();
    } else {
      res.status(403).json("KHONG CO QUYEN ADMIN");
      console.log("admin: " + JSON.stringify(req.user));
    }
  });
};

module.exports = {
  authorizationJwt,
  adminAuthorization,
};
