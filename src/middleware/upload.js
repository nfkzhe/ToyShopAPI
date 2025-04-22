const multer = require("multer");
const path = require("path");
const fs = require("fs");

const makeStorage = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "..", "uploads", folderName);
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e5) + ext;
      cb(null, uniqueName);
    }
  });
  return multer({ storage });
};

const uploadAvatar = makeStorage("avatar").single("image");
const uploadProductImages = makeStorage("product").array("images", 5); // max 5 ảnh

module.exports = {
  uploadAvatar,
  uploadProductImages,
};
