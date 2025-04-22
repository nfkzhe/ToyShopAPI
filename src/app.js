const express = require('express');
const apiRoute = require('./routes');
const cors = require('cors');
const path = require("path");
const UserModel = require("./models/user");
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
require('./DB/mongo');
const fs = require('fs');
const app = express();

app.use(cors({
  origin: ['http://192.168.1.2:5713','http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/publics'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

const uploadsDir = path.join(__dirname, 'uploads');
// Hàm tạo thư mục nếu chưa tồn tại và cấp quyền
const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Thư mục ${dirPath} đã được tạo.`);

    // Cấp quyền cho thư mục
    fs.chmodSync(dirPath, 0o777);  // Cấp quyền đọc, ghi và thực thi cho tất cả người dùng
  } else {
    console.log(`Thư mục ${dirPath} đã tồn tại.`);
  }
};

// Tạo các thư mục khi ứng dụng khởi động
createDirectoryIfNotExists(uploadsDir);
app.use((req, res, next) => {
  next();
});
app.get("/dashboard", async function(req, res) {
  const users = await UserModel.find();
  res.render('./dashboard/index', { user_ar: users });
});
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', function (req, res) {
  res.send('Api is running');
});

app.use('/api', apiRoute);

app.get('/api*', function (req, res) {
  return res.json({ message: 'api not found' });
});

// ❌ Bỏ dòng này:
// app.listen(3002);

// ✅ Thay bằng export
module.exports = app;
