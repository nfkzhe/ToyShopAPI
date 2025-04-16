const express = require('express');
const apiRoute = require('./routes');
const cors = require('cors');
const path = require("path");
const UserModel = require("./models/user");
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
require('./DB/mongo');

const app = express();

app.use(cors({
  origin: 'https://toy-shop-fe-phi.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

app.use((req, res, next) => {
  next();
});

app.get("/dashboard", async function(req, res) {
  const users = await UserModel.find();
  res.render('./dashboard/index', { user_ar: users });
});

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
