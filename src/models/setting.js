const mongoose = require("mongoose")

const settingSchema = new mongoose.Schema({
  shopName: String,
  logo: String,
  favicon: String,
  hotline: String,
  email: String,
  description: String
})

module.exports = mongoose.model("Setting", settingSchema)
