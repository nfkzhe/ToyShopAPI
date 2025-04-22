const mongoose = require('mongoose');
const Nanoid = require('nanoid');
const Schema = mongoose.Schema;

const id = Nanoid.customAlphabet('ORD1234567890', 8);
const today = new Date().toISOString().substring(0, 10);

const order = new Schema({
    _id: { type: String, default: () => id() },
    userId: { type: String, ref: 'user', required: true },
    date: { type: String, default: today }, // hoặc type: Date nếu bạn muốn xử lý thời gian
    status: { type: String, enum: ['Đang xử lý', 'Đang giao hàng', 'Đã giao hàng', 'Đã huỷ'], default: 'Đang xử lý' },
    total: { type: Number, default: 0 },
});

module.exports = mongoose.model('order', order);
