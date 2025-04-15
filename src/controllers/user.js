const UserModel = require("../models/user");
const { comparePassword, hashPassword } = require("../utils");
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
  const comparePassword = await comparePassword(pass, pass);
  if (comparePassword == true) {
    try {
      const hashed = await hashPassword(newpass);
      const updatePass = { pass: hashed };
      const update = await UserModel.findByIdAndUpdate(userID, updatePass);
      return res.status(200).json("Da update", update);
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(500).json("sai mat khau cu");
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


module.exports = {
  getAll,
  editProfile,
  delUser,
  changePass,
  findUser,
};
