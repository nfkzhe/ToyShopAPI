const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderDetail = new Schema({
    orderId: { type: String, ref: 'order', required: true },
    productId: { type: String, ref: 'product', required: true },
    name: { type: String }, // tên sản phẩm tại thời điểm đặt hàng
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
});

module.exports = mongoose.model('orderDetail', orderDetail);
