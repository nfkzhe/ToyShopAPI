const User = require("../models/user");
const { generateToken, hashPassword, comparePassword } = require("../utils");
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
  if (email && pass) {
    const check = await User.findOne({ email: email }, { password: 0 });
    if (check === null) {
      res.status(404).json({ message: "Sai email." });
    } else {
      const comparePass = await comparePassword(pass, check.pass);
      console.log(comparePass, "check pass");
      if (comparePass == true) {
        const token = generateToken(check._id);
        console.log("id", check._id);
        req.session.token = token;
        req.session.user = check;
        console.log(req.session);
        res.json({
          message: "dang nhap thanh cong",
          data: check,
          token: token,
        });
      } else {
        res.status(404).json({ message: "Sai mật khẩu." });
      }
    }
  } else {
    res.status(404).json({ message: "Sai tài khoản hoặc mật khẩu." });
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
