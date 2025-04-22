const UserModel = require("../models/user");
const { comparePassword, hashPassword } = require("../utils");

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
require("dotenv/config");

const getAll = async (req, res) => {
  const keyWord = req.query.keyWord;
  const { page = 1, limit = 2 } = req.query;

  // tim ten den tu query string
  let condition = {};
  if (keyWord && keyWord.length > 0) {
    condition.email = { $regex: keyWord, $options: "i" };
  }
  // pagination có kèm theo đk
  const userlists = await UserModel.find(condition)
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  // dem so luong document thoa dk
  const count = await UserModel.countDocuments(condition);
  return res.json({
    userlists,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
};

const editProfile = async (req, res) => {
  const userID = req.params;
  const { ten, address, sex, phone } = req.body;
  try {
    const updateData = {
      ten: ten,
      address: address,
      sex: sex,
      phone: phone,
    };
    await UserModel.findByIdAndUpdate(userID, updateData);
    return res.status(200).json("Da update", updateData);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const delUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await UserModel.deleteOne({ _id: userId });
    return res.status(200).json({ mesage: "xóa thành công " });
  }catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};

const changePass = async (req, res) => {
  const { userID } = req.params;
  const { pass, newpass } = req.body;

  const user = await UserModel.findById(userID);
  if (!user) return res.status(404).json("User not found");

  const isCorrect = await comparePassword(pass, user.pass);
  if (isCorrect) {
    try {
      const hashed = await hashPassword(newpass);
      await UserModel.findByIdAndUpdate(userID, { pass: hashed });
      return res.status(200).json("Đổi mật khẩu thành công");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(400).json("Sai mật khẩu cũ");
  }
};


const findUser = async (req, res) => {
  const userID = req.user.id;
  try {
    const user = await UserModel.findById(userID);
    return res.status(200).json({status:200, message: "GetUserInfo", data: user});
  } catch (error) {
    console.log(error)
    return res.status(500).json(error);
  }
};

const getProfile = async (req, res) => {
  
  try {
    const user = await UserModel.findById(req.user.id).select('-password'); // loại bỏ password

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    console.log("🍪 Cookies gửi từ client:", req.cookies)
    res.status(500).json({ message: 'Lỗi server' });
  }
};

const uploadAvatar = async (req, res) => {
  const userID = req.user.id;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Không có file được upload!" });

  try {
    const user = await UserModel.findById(userID);
    if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    // Xóa avatar cũ (nếu có)
    if (user.avatar) {
      const oldPath = path.join(__dirname, '..', 'uploads', 'avatar', user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = file.filename;
    await user.save();

    res.status(200).json({
      message: "Upload avatar thành công",
      avatar: file.filename
    });

  } catch (err) {
    console.error("Lỗi trong quá trình upload avatar:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


module.exports = {
  getAll,
  editProfile,
  delUser,
  changePass,
  findUser,
  getProfile,
  uploadAvatar,

};
