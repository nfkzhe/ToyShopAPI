const User = require("../models/user");
const { generateToken, hashPassword, comparePassword } = require("../utils");
const jwt = require('jsonwebtoken');
require("dotenv/config");

const register = async (req, res) => {
  try {
    const { email, pass, ten } = req.body;
    const hashed = await hashPassword(pass);

    if (email && pass && ten) {
      const check = await User.findOne({ email: email });
      if (check === null) {
        const cre = await User.create({
          ten: ten,
          email: email,
          pass: hashed,
        });
        const userSafe = { ...cre._doc };
        delete userSafe.pass;
        return res
          .status(200)
          .json({ message: "dang ky thanh cong", data: userSafe });
      } else {
        return res
          .status(500)
          .json({ message: "dang ky that bai tai khoan da ton tai" });
      }
    } else {
      return res.status(500).json({ message: "dang ky that bai" });
    }
  } catch (err) {
    console.log(err);
  }
};

const login = async (req, res) => {
  const { email, pass } = req.body;
  if (email && pass) {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Sai email." });
    }

    const isMatch = await comparePassword(pass, user.pass);
    if (!isMatch) {
      return res.status(404).json({ message: "Sai mật khẩu." });
    }

    const { password, ...userWithoutPassword } = user._doc;
    const token = jwt.sign({ id: user._id, email , role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });

    // 🧁 Set cookie thay vì gửi token
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false, // Chỉ bật secure khi sản xuất
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: userWithoutPassword
    });
  } else {
    return res.status(400).json({ message: "Thiếu email hoặc mật khẩu." });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
  });
  return res.status(200).json({ message: 'Đã đăng xuất' });
};


// const regCoRef = (req, res) => {
//     const conflictError = null;
//     const ref = req.params.ref
//     res.render('./login/dangkycoref.ejs' , {conflictError: conflictError, ref: ref});
// }

module.exports = {
  register,
  login,
  logout,
};
