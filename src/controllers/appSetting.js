
const Setting = require("../models/setting")
const path = require("path")
const fs = require("fs")

const getSettings = async (req, res) => {
  try {
    const setting = await Setting.findOne()
    res.json(setting)
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message })
  }
}

const updateSettings = async (req, res) => {
  try {
    let setting = await Setting.findOne()
    const data = req.body

    // Nếu có file
    if (req.files) {
      if (req.files.logo) {
        const logoPath = req.files.logo[0].path
        const newLogoPath = path.join("uploads", "avatar", req.files.logo[0].filename)
        fs.renameSync(logoPath, newLogoPath)
        data.logo = "/" + newLogoPath.replace(/\\/g, "/")
      }

      if (req.files.favicon) {
        const faviconPath = req.files.favicon[0].path
        const newFaviconPath = path.join("uploads", "avatar", req.files.favicon[0].filename)
        fs.renameSync(faviconPath, newFaviconPath)
        data.favicon = "/" + newFaviconPath.replace(/\\/g, "/")
      }
    }

    if (setting) {
      await Setting.updateOne({}, data)
    } else {
      setting = new Setting(data)
      await setting.save()
    }

    const updated = await Setting.findOne()
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message })
  }
}


module.exports = {
    getSettings,
    updateSettings
};
  