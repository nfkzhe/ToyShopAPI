const Order = require('../models/order');
const OrderDetail = require('../models/orderDetail');
const Product = require('../models/product');

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { userId, shippingAddress, items, totalAmount } = req.body;

    // Tạo order chính
    const newOrder = new Order({
      userId,
      shippingAddress,
      totalAmount,
    });

    const savedOrder = await newOrder.save();

    // Tạo danh sách chi tiết đơn hàng
    const orderDetails = items.map((item) => ({
      orderId: savedOrder._id,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      discount: item.discount,
    }));

    await OrderDetail.insertMany(orderDetails);

    // Cập nhật trường sold của sản phẩm
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { sold: item.quantity } },
        { new: true }
      );
    }

    res.status(201).json({ message: 'Đặt hàng thành công', orderId: savedOrder._id });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đơn hàng' });
  }
};

// Lấy danh sách đơn hàng của 1 user
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    const orderWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetail.find({ orderId: order._id }).populate('productId');
        return { ...order.toObject(), items: details };
      })
    );

    res.status(200).json(orderWithDetails);
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy đơn hàng' });
  }
};

// Lấy chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    const details = await OrderDetail.find({ orderId }).populate('productId');

    res.status(200).json({ ...order.toObject(), items: details });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy đơn hàng' });
  }
};

// Admin lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    const fullOrders = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetail.find({ orderId: order._id }).populate('productId');
        return { ...order.toObject(), items: details };
      })
    );

    res.status(200).json(fullOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi lấy tất cả đơn hàng' });
  }
};
