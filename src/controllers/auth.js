const User = require("../models/user");
const { generateToken, hashPassword, comparePassword } = require("../utils");
const jwt = require('jsonwebtoken');
require("dotenv/config");

const register = async (req, res) => {
  try {
    const { email, pass, ten, } = req.body;
    const hashed = await hashPassword(pass);

    if (email && pass && ten) {
      const check = await User.findOne({ email: email });
      if (check === null) {
        const cre = await User.create({
          ten: ten,
          email: email,
          pass: hashed,
        });
        return res
          .status(200)
          .json({ message: "dang ky thanh cong", data: cre });
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
  console.log(email, pass)
  if (email && pass) {
    const user = await User.findOne({ email }); // KHÔNG loại password ở đây
    if (!user) {
      return res.status(404).json({ message: "Sai email." });
    }

    // So sánh đúng cách
    const isMatch = await comparePassword(pass, user.pass);
    if (!isMatch) {
      return res.status(404).json({ message: "Sai mật khẩu." });
    }

    // Xóa password thủ công trước khi trả về
    const { password, ...userWithoutPassword } = user._doc;
    const token = jwt.sign({ id: user._id, email: email }, process.env.SECRET_KEY, { expiresIn: '1d' });

    req.session.token = token;
    req.session.user = userWithoutPassword;

    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: userWithoutPassword,
      token,
    });
  } else {
    return res.status(404).json({ message: "Sai mật khẩu." });
  }
};

// const regCoRef = (req, res) => {
//     const conflictError = null;
//     const ref = req.params.ref
//     res.render('./login/dangkycoref.ejs' , {conflictError: conflictError, ref: ref});
// }

module.exports = {
  register,
  login,
};
