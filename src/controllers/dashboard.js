const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');
const moment = require('moment');

const getOverviewStats = async (req, res) => {
  try {
    const [orders, users, products] = await Promise.all([
      Order.find(),
      User.find(),
      Product.find(),
    ]);

    const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.status(200).json({
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.length,
      totalProducts: products.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRevenueChart = async (req, res) => {
  try {
    const currentYear = moment().year();
    const monthlyRevenue = Array(12).fill(0);

    const orders = await Order.find({
      createdAt: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    });

    orders.forEach(order => {
      const month = moment(order.createdAt).month(); // 0-11
      monthlyRevenue[month] += order.totalAmount;
    });

    res.status(200).json(monthlyRevenue);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getCategoryDistribution = async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find();

    const distribution = categories.map(category => {
      const count = products.filter(p => p.categoryId === category._id).length;
      const conut1 = products.filter(p => p.categoryId === category._id)
      return {
        category: category.CateName,
        count,
      };
    });

    res.status(200).json(distribution);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Product.find().sort({ sold: -1 }).limit(5);
    res.status(200).json(topProducts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'username email');

    res.status(200).json(recentOrders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


module.exports = {
    getCategoryDistribution,
    getTopProducts,
    getRecentOrders,
    getRevenueChart,
    getOverviewStats,
}