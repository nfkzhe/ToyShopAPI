const jwt = require("jsonwebtoken");

const authorizationJwt = (req, res, next) => {
  var token = req.session.token;
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "token is required" });
  }
  const parseToken = token;
  if (parseToken) {
    jwt.verify(parseToken, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return res.status(403).json({ message: "token not correct" });
      }
      req.user = decoded.data;
      console.log(req.user);
      next();
    });
  } else {
    return res.status(401).json({ message: "NOT AUTHENTICATED" });
  }
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
