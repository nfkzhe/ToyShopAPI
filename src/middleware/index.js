const jwt = require("jsonwebtoken");

const authorizationJwt = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập hoặc token không tồn tại' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // gắn user info để dùng ở controller
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};


const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: "Chỉ admin mới được phép" });
  }
  next();
};


module.exports = {
  authorizationJwt,
  isAdmin,
};
